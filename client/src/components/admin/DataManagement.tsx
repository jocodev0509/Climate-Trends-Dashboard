/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Save, X } from 'lucide-react';
import type { ClimateData, Region } from '../../types';
import { useAuthStore } from "@/features/auth/store";
import axios from 'axios';

export const DataManagement: React.FC = () => {
  const { token } = useAuthStore();
  const [climateData, setClimateData] = useState<ClimateData[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    region_id: 0,
    avg_temp: 0,
    co2_level: 0,
    precipitation: 0,
  });

  useEffect(() => {
    loadData();
    loadRegions();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/climate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClimateData(response.data); // Limit for demo
      setError('');
    } catch (err: any) {
      setError('Failed to load climate data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRegions = async () => {
    try {
      const response = await axios.get("/api/regions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      await setRegions(response.data);
      console.log(response.data);
      
    } catch (err) {
      console.error('Failed to load regions:', err);
    }
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post("/api/climate", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClimateData([response.data, ...climateData]);
      setShowAddForm(false);
      resetForm();
    } catch (err: any) {
      alert('Failed to add climate data');
      console.error(err);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await axios.put(`/api/climate/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClimateData(climateData.map(item =>
        item.id === id ? response.data : item
      ));
      setEditingId(null);
      resetForm();
    } catch (err: any) {
      alert('Failed to update climate data');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this data entry?')) return;

    try {
      await axios.delete(`/api/climate/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClimateData(climateData.filter(item => item.id !== id));
    } catch (err: any) {
      alert('Failed to delete climate data');
      console.error(err);
    }
  };

  const startEdit = (item: ClimateData) => {
    setEditingId(item.id);
    setFormData({
      year: item.year,
      region_id: Number(regions.find(r => r.name === item.region)?.id) || 0,
      avg_temp: item.avg_temp,
      co2_level: item.co2_level,
      precipitation: item.precipitation,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear(),
      region_id: 0,
      avg_temp: 0,
      co2_level: 0,
      precipitation: 0,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Climate Data Management</h3>
        <div className="flex space-x-2">
          <button
            onClick={loadData}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Data</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New Climate Data</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                min="2000"
                max="2030"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                value={formData.region_id}
                onChange={(e) =>
                  setFormData({ ...formData, region_id: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Select Region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name} {/* Display value to user */}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avg Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.avg_temp}
                onChange={(e) => setFormData({ ...formData, avg_temp: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CO₂ (ppm)</label>
              <input
                type="number"
                step="0.1"
                value={formData.co2_level}
                onChange={(e) => setFormData({ ...formData, co2_level: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precipitation (mm)</label>
              <input
                type="number"
                value={formData.precipitation}
                onChange={(e) => setFormData({ ...formData, precipitation: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Data
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Temp (°C)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CO₂ (ppm)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precipitation (mm)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {climateData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {editingId === item.id ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={formData.region_id}
                        onChange={(e) =>
                          setFormData({ ...formData, region_id: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={formData.region_id}>Select Region</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name} {/* Display value to user */}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.1"
                        value={formData.avg_temp}
                        onChange={(e) => setFormData({ ...formData, avg_temp: parseFloat(e.target.value) })}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.1"
                        value={formData.co2_level}
                        onChange={(e) => setFormData({ ...formData, co2_level: parseFloat(e.target.value) })}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={formData.precipitation}
                        onChange={(e) => setFormData({ ...formData, precipitation: parseInt(e.target.value) })}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-900 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.avg_temp.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.co2_level.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.precipitation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500">
        Showing {climateData.length} entries (limited for demo)
      </div>
    </div>
  );
};