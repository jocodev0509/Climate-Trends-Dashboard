"use client";

import React, { useEffect, useState } from "react";
import { Filter, Download, RefreshCw } from 'lucide-react';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';
import { AreaChart } from '../charts/AreaChart';
import { regionsApi } from '../../services/api';
import type { ClimateData, Region, ClimateFilters, ChartData } from '../../types';
import { useAuthStore } from "@/features/auth/store";
import axios from "axios";

export const Dashboard: React.FC = () => {
  const { token } = useAuthStore();
  const [climateData, setClimateData] = useState<ClimateData[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [filters, setFilters] = useState<ClimateFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    loadRegions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get("/api/climate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      
      let filteredData = [...res.data];

      if (filters?.region) {
        filteredData = filteredData.filter(d => d.region === filters.region);
      }

      if (filters?.startYear) {
        filteredData = filteredData.filter(d => d.year >= filters.startYear!);
      }

      if (filters?.endYear) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        filteredData = filteredData.filter(d => d.year <= filters.endYear!);
      }

      setClimateData(filteredData);
      setError('');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError('Failed to load climate data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRegions = async () => {
    try {
      const response = await regionsApi.getRegions();
      setRegions(response.data);
    } catch (err) {
      console.error('Failed to load regions:', err);
    }
  };

  const getTemperatureData = (): ChartData[] => {
    if (!filters.region) {
      // Global average by year
      const yearlyData = climateData.reduce((acc, item) => {
        if (!acc[item.year]) {
          acc[item.year] = { total: 0, count: 0 };
        }
        acc[item.year].total += item.avg_temp;
        acc[item.year].count += 1;
        return acc;
      }, {} as Record<number, { total: number; count: number }>);

      return Object.entries(yearlyData)
        .map(([year, data]) => ({
          x: parseInt(year),
          y: data.total / data.count,
        }))
        .sort((a, b) => (a.x as number) - (b.x as number));
    } else {
      // Regional data by year
      return climateData
        .filter(d => d.region === filters.region)
        .map(d => ({ x: d.year, y: d.avg_temp }))
        .sort((a, b) => (a.x as number) - (b.x as number));
    }
  };

  const getCO2Data = (): ChartData[] => {
    // Average CO2 by region for latest year
    const latestYear = Math.max(...climateData.map(d => d.year));
    const latestData = climateData.filter(d => d.year === latestYear);

    return latestData.map(d => ({
      x: d.region,
      y: d.co2_level,
    }));
  };

  const getPrecipitationData = (): ChartData[] => {
    if (!filters.region) {
      // Global average by year
      const yearlyData = climateData.reduce((acc, item) => {
        if (!acc[item.year]) {
          acc[item.year] = { total: 0, count: 0 };
        }
        acc[item.year].total += item.precipitation;
        acc[item.year].count += 1;
        return acc;
      }, {} as Record<number, { total: number; count: number }>);

      return Object.entries(yearlyData)
        .map(([year, data]) => ({
          x: parseInt(year),
          y: data.total / data.count,
        }))
        .sort((a, b) => (a.x as number) - (b.x as number));
    } else {
      // Regional data by year
      return climateData
        .filter(d => d.region === filters.region)
        .map(d => ({ x: d.year, y: d.precipitation }))
        .sort((a, b) => (a.x as number) - (b.x as number));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleFilterChange(key: keyof ClimateFilters, value: any): void {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  }

  const clearFilters = () => {
    setFilters({});
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Data Filters
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear All
            </button>
            <button
              onClick={loadData}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              value={filters.region || ''}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region.id} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Year
            </label>
            <input
              type="number"
              min="2000"
              max="2023"
              value={filters.startYear || ''}
              onChange={(e) => handleFilterChange('startYear', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Year
            </label>
            <input
              type="number"
              min="2000"
              max="2023"
              value={filters.endYear || ''}
              onChange={(e) => handleFilterChange('endYear', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2023"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {/* Export functionality */ }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Charts */}
      {!isLoading && climateData.length > 0 && (
        <div className="space-y-8">
          {/* Temperature Chart */}
          <div>
            <LineChart
              data={getTemperatureData()}
              title={`Average Temperature Over Time${filters.region ? ` - ${filters.region}` : ' (Global)'}`}
              xLabel="Year"
              yLabel="Temperature (°C)"
              color="#EF4444"
            />
          </div>

          {/* CO2 Chart */}
          <div>
            <BarChart
              data={getCO2Data()}
              title="CO₂ Levels by Region (Latest Year)"
              xLabel="Region"
              yLabel="CO₂ Level (ppm)"
              color="#F59E0B"
            />
          </div>

          {/* Precipitation Chart */}
          <div>
            <AreaChart
              data={getPrecipitationData()}
              title={`Precipitation Over Time${filters.region ? ` - ${filters.region}` : ' (Global)'}`}
              xLabel="Year"
              yLabel="Precipitation (mm)"
              color="#06B6D4"
            />
          </div>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && climateData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No climate data found for the selected filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
