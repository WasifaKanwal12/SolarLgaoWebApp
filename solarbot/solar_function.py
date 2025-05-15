import requests
from geopy.geocoders import Nominatim

PANEL_WATTAGE = 400  # W
SYSTEM_EFFICIENCY = 0.75
DAILY_BACKUP_HOURS = 4

def get_lat_long(location_name):
    geolocator = Nominatim(user_agent="geoapi")
    location = geolocator.geocode(location_name)
    return (location.latitude, location.longitude) if location else (None, None)

def get_solar_data(location_name):
    lat, lon = get_lat_long(location_name)
    if not lat or not lon:
        return None

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": "shortwave_radiation_sum",
        "timezone": "auto"
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        return None

    data = response.json()

    try:
        radiation_values = data["daily"]["shortwave_radiation_sum"]
        if not radiation_values:
            return None

        avg_mj_per_m2 = sum(radiation_values) / len(radiation_values)
        avg_kwh_per_m2 = avg_mj_per_m2 / 3.6  # Convert MJ/m²/day to kWh/m²/day

        return {"avg_daily_kwh": round(avg_kwh_per_m2, 2)}
    except Exception:
        return None
    
print(get_solar_data("New York"))
