"use client";

import React from "react";

type ClimateData = {
  id: number;
  year: number;
  region: string;
  avg_temp: number;
  co2_level: number;
  precipitation: number;
};

type Props = {
  data: ClimateData[];
  loading: boolean;
  error: string | null;
};

export function DataTable({ data, loading, error }: Props) {
  if (loading) return <p>Loading data table...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data.length) return <p>No data to display</p>;

  return (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">Year</th>
          <th className="border border-gray-300 p-2">Region</th>
          <th className="border border-gray-300 p-2">Avg Temp (°C)</th>
          <th className="border border-gray-300 p-2">CO₂ Level (ppm)</th>
          <th className="border border-gray-300 p-2">Precipitation (mm)</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, year, region, avg_temp, co2_level, precipitation }) => (
          <tr key={id}>
            <td className="border border-gray-300 p-2">{year}</td>
            <td className="border border-gray-300 p-2">{region}</td>
            <td className="border border-gray-300 p-2">{avg_temp.toFixed(2)}</td>
            <td className="border border-gray-300 p-2">{co2_level.toFixed(2)}</td>
            <td className="border border-gray-300 p-2">{precipitation.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
