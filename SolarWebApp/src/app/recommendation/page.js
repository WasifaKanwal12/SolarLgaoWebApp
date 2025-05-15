"use client";

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RecommendationPage() {
  const [formData, setFormData] = useState({ 
    location: '', 
    electricity_kwh_per_month: '', 
    usage_prompt: '' 
  });
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setRecommendations(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/spreadsheets');

    try {
      const result = await signInWithPopup(auth, provider);
      const token = GoogleAuthProvider.credentialFromResult(result).accessToken;
      setAccessToken(token);
      return token;
    } catch (err) {
      console.error('Google sign-in failed:', err);
      alert('Google Sign-In failed. Please try again.');
    }
  };

  const exportToGoogleSheets = async () => {
    if (!transformedRecommendations.length) return;

    let token = accessToken;
    if (!token) {
      token = await loginWithGoogle();
      if (!token) return;
    }

    setIsLoading(true);

    try {
      const headers = ['System Size', 'Panels', 'Inverter', 'Battery', 'System Type', 'Panel Type', 'Backup Hours', 'Payback Period'];
      const rows = transformedRecommendations.map((rec, i) => [
        `${rec.system_size} ${rec.system_size_unit}`,
        `${rec.solar_panels} ${rec.solar_panels_unit}`,
        `${rec.inverter_size} ${rec.inverter_size_unit}`,
        `${rec.battery_storage} ${rec.battery_storage_unit}`,
        rec.system_type,
        rec.panel_type,
        `${rec.backup_hours} ${rec.backup_hours_unit}`,
        `${rec.payback_period} ${rec.payback_period_unit}`
      ]);
      const sheetData = [headers, ...rows];

      const response = await fetch('/api/spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: token,
          title: `Solar Recommendations - ${new Date().toLocaleDateString()}`,
          sheetData,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        window.open(result.url, '_blank');
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export to Google Sheets.');
    } finally {
      setIsLoading(false);
    }
  };

  // Transform metrics into a more usable format
  const transformedRecommendations = recommendations.map(rec => {
    const result = {};
    rec.metrics.forEach(metric => {
      if (metric.name !== 'daily_consumption' && metric.name !== 'solar_hours') {
        result[metric.name] = metric.value;
        result[`${metric.name}_unit`] = metric.unit;
      }
    });
    return result;
  });

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Solar System Recommendation</h1>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="location"
              placeholder="Location (e.g. Lahore, Pakistan)"
              value={formData.location}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
            <input
              name="electricity_kwh_per_month"
              placeholder="Monthly Electricity Consumption (kWh)"
              type="number"
              value={formData.electricity_kwh_per_month}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
            <textarea
              name="usage_prompt"
              placeholder="OR describe your electricity usage (e.g. 'I use 2 ACs for 8 hours daily')"
              value={formData.usage_prompt}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              rows={3}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-200"
            >
              {isLoading ? 'Calculating...' : 'Get Recommendations'}
            </button>
          </form>

          {transformedRecommendations.length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recommended Solar System</h2>
                <button
                  onClick={exportToGoogleSheets}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-200"
                >
                  {isLoading ? 'Exporting...' : 'Export to Google Sheets'}
                </button>
              </div>
              <table className="w-full table-auto border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2">System Size</th>
                    <th className="p-2">Panels</th>
                    <th className="p-2">Inverter</th>
                    <th className="p-2">Battery</th>
                    <th className="p-2">System Type</th>
                    <th className="p-2">Panel Type</th>
                    <th className="p-2">Backup</th>
                    <th className="p-2">Payback</th>
                  </tr>
                </thead>
                <tbody>
                  {transformedRecommendations.map((rec, i) => (
                    <tr key={i} className="text-center border-t">
                      <td className="p-2">{rec.system_size} {rec.system_size_unit}</td>
                      <td className="p-2">{rec.solar_panels} {rec.solar_panels_unit}</td>
                      <td className="p-2">{rec.inverter_size} {rec.inverter_size_unit}</td>
                      <td className="p-2">{rec.battery_storage} {rec.battery_storage_unit}</td>
                      <td className="p-2">{rec.system_type}</td>
                      <td className="p-2">{rec.panel_type}</td>
                      <td className="p-2">{rec.backup_hours} {rec.backup_hours_unit}</td>
                      <td className="p-2">{rec.payback_period} {rec.payback_period_unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}