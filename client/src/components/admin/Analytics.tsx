import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Database, Globe } from 'lucide-react';
import { useAuthStore } from "@/features/auth/store";
import axios from 'axios'
import type { ClimateData, User } from '../../types';

export const Analytics: React.FC = () => {
  const { token } = useAuthStore();
  const [climateData, setClimateData] = useState<ClimateData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const climateResponse = await axios.get("/api/climate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersResponse = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClimateData(climateResponse.data);
      setUsers(usersResponse.data);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRegionStats = () => {
    const regionCounts = climateData.reduce((acc, item) => {
      acc[item.region] = (acc[item.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(regionCounts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getTemperatureTrends = () => {
    const yearlyAvg = climateData.reduce((acc, item) => {
      if (!acc[item.year]) {
        acc[item.year] = { total: 0, count: 0 };
      }
      acc[item.year].total += item.avg_temp;
      acc[item.year].count += 1;
      return acc;
    }, {} as Record<number, { total: number; count: number }>);

    const trends = Object.entries(yearlyAvg)
      .map(([year, data]) => ({
        year: parseInt(year),
        avgTemp: data.total / data.count,
      }))
      .sort((a, b) => a.year - b.year);

    const recentYears = trends.slice(-5);
    const tempChange = recentYears.length > 1
      ? recentYears[recentYears.length - 1].avgTemp - recentYears[0].avgTemp
      : 0;

    return { trends, tempChange };
  };

  const getUserStats = () => {
    const activeUsers = users.filter(u => u.is_active === true).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const recentUsers = users.filter(u => {
      const createdDate = new Date(u.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate > thirtyDaysAgo;
    }).length;

    return { activeUsers, adminUsers, recentUsers };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const regionStats = getRegionStats();
  const { tempChange } = getTemperatureTrends();
  const { activeUsers, adminUsers, recentUsers } = getUserStats();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Analytics Dashboard</h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Data Points</p>
              <p className="text-2xl font-bold text-blue-900">{climateData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Active Users</p>
              <p className="text-2xl font-bold text-green-900">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <Globe className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Regions Covered</p>
              <p className="text-2xl font-bold text-purple-900">{regionStats.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Temp Change (5yr)</p>
              <p className="text-2xl font-bold text-orange-900">
                {tempChange > 0 ? '+' : ''}{tempChange.toFixed(2)}°C
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Data Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Data by Region</h4>
          <div className="space-y-3">
            {regionStats.map((stat) => (
              <div key={stat.region} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{stat.region}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(stat.count / regionStats[0].count) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {stat.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-4">User Statistics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="text-lg font-semibold text-gray-900">{users.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-lg font-semibold text-green-600">{activeUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Admin Users</span>
              <span className="text-lg font-semibold text-purple-600">{adminUsers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Users (30 days)</span>
              <span className="text-lg font-semibold text-blue-600">{recentUsers}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User Activity Rate</span>
                <span className="text-lg font-semibold text-gray-900">
                  {((activeUsers / users.length) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-medium text-gray-900 mb-4">System Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {new Date().getFullYear() - Math.min(...climateData.map(d => d.year))}
            </p>
            <p className="text-sm text-gray-600">Years of Data</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {Math.round(climateData.reduce((sum, d) => sum + d.avg_temp, 0) / climateData.length * 10) / 10}°C
            </p>
            <p className="text-sm text-gray-600">Global Avg Temperature</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {Math.round(climateData.reduce((sum, d) => sum + d.co2_level, 0) / climateData.length)}
            </p>
            <p className="text-sm text-gray-600">Avg CO₂ Level (ppm)</p>
          </div>
        </div>
      </div>
    </div>
  );
};