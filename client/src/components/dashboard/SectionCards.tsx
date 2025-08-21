"use client";

import React from "react";

export function SectionCards() {
  // You can fetch or receive summary data as props if you want
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-lg bg-white shadow p-4">
        <h3 className="font-semibold text-lg">Average Temperature</h3>
        <p>23.5 °C</p>
      </div>
      <div className="rounded-lg bg-white shadow p-4">
        <h3 className="font-semibold text-lg">Average CO₂ Level</h3>
        <p>412 ppm</p>
      </div>
      <div className="rounded-lg bg-white shadow p-4">
        <h3 className="font-semibold text-lg">Average Precipitation</h3>
        <p>85 mm</p>
      </div>
    </div>
  );
}
