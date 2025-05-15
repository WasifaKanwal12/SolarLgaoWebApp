from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Any
import os
import re
import json
import hashlib
from functools import lru_cache
from dotenv import load_dotenv
import google.generativeai as genai

from solar_function import get_lat_long, get_solar_data, PANEL_WATTAGE, SYSTEM_EFFICIENCY, DAILY_BACKUP_HOURS

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input model
class UserQuery(BaseModel):
    location: str = Field(..., min_length=3)
    electricity_kwh_per_month: Optional[int] = Field(None, ge=100, le=5000)
    usage_prompt: Optional[str] = Field(None, min_length=10)

# Metric item model
class SystemMetric(BaseModel):
    name: str
    description: str
    value: Any
    unit: str

# Output model
class SolarRecommendation(BaseModel):
    summary: str
    metrics: List[SystemMetric]

# Hashing input for cache
def hash_inputs(inputs: dict) -> str:
    return hashlib.md5(json.dumps(inputs, sort_keys=True).encode()).hexdigest()

# Main calculator class
class SystemCalculator:
    @staticmethod
    @lru_cache(maxsize=128)
    def calculate(daily_kwh: float, solar_irradiance: float):
        solar_hours = solar_irradiance
        system_kw = daily_kwh / (solar_hours * SYSTEM_EFFICIENCY)
        panel_count = int((system_kw * 1000) / PANEL_WATTAGE)
        inverter_kw = system_kw * 1.15
        battery_kwh = daily_kwh * DAILY_BACKUP_HOURS

        return {
            "system_kw": round(system_kw, 2),
            "panels": panel_count,
            "inverter": round(inverter_kw, 2),
            "battery": round(battery_kwh, 1),
            "daily_gen": round(system_kw * solar_hours * SYSTEM_EFFICIENCY, 2)
        }

# Function to calculate tariff based on slab
def calculate_tariff(units: float) -> float:
    total = 0
    slabs = [
        (50, 3.95),
        (50, 7.74),
        (100, 10.06),
        (100, 12.15),
        (400, 19.55),
        (float('inf'), 35.22),
    ]
    
    for slab_units, rate in slabs:
        if units > 0:
            consume = min(units, slab_units)
            total += consume * rate
            units -= consume
        else:
            break
    return total

# Try to extract consumption, return None if not possible
def estimate_consumption(prompt: str) -> Optional[float]:
    try:
        response = model.generate_content(
            f"Extract numerical daily electricity consumption in kWh from this text, "
            f"return ONLY a number. Example: 8.5\nText: {prompt}"
        )
        estimated = re.sub(r"[^\d.]", "", response.text.strip())
        return float(estimated) if estimated else None
    except:
        return None

# Fallback Gemini-based summary if consumption can't be extracted
def generate_llm_recommendation(location: str, usage_prompt: str) -> SolarRecommendation:
    prompt = (
        f"Location: {location}\n"
        f"User Description: {usage_prompt}\n\n"
        f"Based on this information, generate a plain-language solar system recommendation. "
        f"Assume the location has moderate solar irradiance. Estimate daily consumption if possible, "
        f"and describe system size, panel type, inverter, and battery in simple terms. Keep it under 150 words."
    )
    try:
        response = model.generate_content(prompt)
        return SolarRecommendation(
            summary="AI-based Solar Suggestion",
            metrics=[SystemMetric(
                name="llm_summary",
                description="AI-generated system recommendation",
                value=response.text.strip(),
                unit=""
            )]
        )
    except Exception as e:
        raise HTTPException(500, f"LLM failed: {str(e)}")

# API route
@app.post("/recommend", response_model=SolarRecommendation)
async def get_recommendation(query: UserQuery):
    if not (query.electricity_kwh_per_month or query.usage_prompt):
        raise HTTPException(400, "Provide either consumption number or usage description")

    lat, lon = get_lat_long(query.location)
    if not lat or not lon:
        raise HTTPException(400, "Location lookup failed")

    if query.electricity_kwh_per_month:
        daily_kwh = query.electricity_kwh_per_month / 30
    elif query.usage_prompt:
        estimated = estimate_consumption(query.usage_prompt)
        if estimated:
            daily_kwh = estimated
        else:
            return generate_llm_recommendation(query.location, query.usage_prompt)
    else:
        raise HTTPException(400, "Provide valid input")

    solar_data = get_solar_data(query.location)
    if not solar_data or 'avg_daily_kwh' not in solar_data:
        raise HTTPException(500, "Solar data unavailable")

    calc = SystemCalculator.calculate(
        round(daily_kwh, 2), 
        round(solar_data['avg_daily_kwh'], 2)
    )

    # Static assumptions
    system_type = "On-Grid with Battery Backup"
    panel_type = f"{PANEL_WATTAGE}W Monocrystalline"
    backup_hours = DAILY_BACKUP_HOURS
    average_tariff = calculate_tariff(query.electricity_kwh_per_month) / query.electricity_kwh_per_month  # Tariff calculation

    daily_savings = round(daily_kwh * average_tariff, 2)
    system_cost = round(calc["system_kw"] * 180000, 0)  # 180,000 PKR per kW (adjustable)
    payback_years = round(system_cost / (daily_savings * 365), 1)

    metrics = [
        SystemMetric(
            name="daily_consumption",
            description="Estimated daily electricity usage",
            value=round(daily_kwh, 2),
            unit="kWh"
        ),
        SystemMetric(
            name="solar_hours",
            description="Average daily peak sun hours",
            value=solar_data['avg_daily_kwh'],
            unit="hours"
        ),
        SystemMetric(
            name="system_size",
            description="Recommended solar system size",
            value=calc['system_kw'],
            unit="kW"
        ),
        SystemMetric(
            name="solar_panels",
            description=f"{PANEL_WATTAGE}W panels required",
            value=calc['panels'],
            unit="panels"
        ),
        SystemMetric(
            name="inverter_size",
            description="Recommended inverter capacity",
            value=calc['inverter'],
            unit="kW"
        ),
        SystemMetric(
            name="battery_storage",
            description="Recommended battery backup",
            value=calc['battery'],
            unit="kWh"
        ),
        SystemMetric(
            name="system_type",
            description="Suggested solar system configuration",
            value=system_type,
            unit=""
        ),
        SystemMetric(
            name="panel_type",
            description="Recommended solar panel type",
            value=panel_type,
            unit=""
        ),
        SystemMetric(
            name="backup_hours",
            description="Battery backup duration",
            value=backup_hours,
            unit="hours"
        ),
        SystemMetric(
            name="payback_period",
            description="Estimated return on investment duration",
            value=payback_years,
            unit="years"
        )
    ]

    return SolarRecommendation(
        summary=f"{calc['system_kw']}kW Solar System Recommendation",
        metrics=metrics
    )
