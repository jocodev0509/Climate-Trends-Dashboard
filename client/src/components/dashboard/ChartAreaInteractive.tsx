import React from "react";
import CO2BarChart from "@/components/charts/CO2BarChart";
import PrecipitationAreaChart from "@/components/charts/PrecipitationAreaChart";
import TemperatureLineChart from "@/components/charts/TemperatureLineChart";

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

export const climateData = [
  // North America
  {
    date: "2000-01-01",
    avg_temp: 14.1,
    co2_level: 370.5,
    precipitation: 920,
    region: "North America",
  },
  {
    date: "2001-01-01",
    avg_temp: 14.3,
    co2_level: 372.4,
    precipitation: 910,
    region: "North America",
  },
  {
    date: "2002-01-01",
    avg_temp: 14.6,
    co2_level: 375.1,
    precipitation: 940,
    region: "North America",
  },
  {
    date: "2003-01-01",
    avg_temp: 14.5,
    co2_level: 377.8,
    precipitation: 880,
    region: "North America",
  },
  {
    date: "2004-01-01",
    avg_temp: 14.7,
    co2_level: 379.6,
    precipitation: 915,
    region: "North America",
  },
  {
    date: "2005-01-01",
    avg_temp: 15.0,
    co2_level: 382.2,
    precipitation: 960,
    region: "North America",
  },
  {
    date: "2006-01-01",
    avg_temp: 15.1,
    co2_level: 384.0,
    precipitation: 945,
    region: "North America",
  },
  {
    date: "2007-01-01",
    avg_temp: 15.3,
    co2_level: 386.2,
    precipitation: 970,
    region: "North America",
  },
  {
    date: "2008-01-01",
    avg_temp: 15.4,
    co2_level: 388.1,
    precipitation: 930,
    region: "North America",
  },
  {
    date: "2009-01-01",
    avg_temp: 15.6,
    co2_level: 390.0,
    precipitation: 955,
    region: "North America",
  },
  {
    date: "2010-01-01",
    avg_temp: 15.7,
    co2_level: 392.5,
    precipitation: 975,
    region: "North America",
  },

  // Europe
  {
    date: "2000-01-01",
    avg_temp: 10.2,
    co2_level: 371.0,
    precipitation: 750,
    region: "Europe",
  },
  {
    date: "2001-01-01",
    avg_temp: 10.4,
    co2_level: 372.9,
    precipitation: 760,
    region: "Europe",
  },
  {
    date: "2002-01-01",
    avg_temp: 10.7,
    co2_level: 375.5,
    precipitation: 780,
    region: "Europe",
  },
  {
    date: "2003-01-01",
    avg_temp: 10.6,
    co2_level: 378.1,
    precipitation: 730,
    region: "Europe",
  },
  {
    date: "2004-01-01",
    avg_temp: 10.8,
    co2_level: 379.9,
    precipitation: 770,
    region: "Europe",
  },
  {
    date: "2005-01-01",
    avg_temp: 11.1,
    co2_level: 382.5,
    precipitation: 800,
    region: "Europe",
  },
  {
    date: "2006-01-01",
    avg_temp: 11.2,
    co2_level: 384.3,
    precipitation: 790,
    region: "Europe",
  },
  {
    date: "2007-01-01",
    avg_temp: 11.4,
    co2_level: 386.5,
    precipitation: 810,
    region: "Europe",
  },
  {
    date: "2008-01-01",
    avg_temp: 11.5,
    co2_level: 388.4,
    precipitation: 775,
    region: "Europe",
  },
  {
    date: "2009-01-01",
    avg_temp: 11.7,
    co2_level: 390.3,
    precipitation: 795,
    region: "Europe",
  },
  {
    date: "2010-01-01",
    avg_temp: 11.8,
    co2_level: 392.8,
    precipitation: 815,
    region: "Europe",
  },

  // Asia
  {
    date: "2000-01-01",
    avg_temp: 23.5,
    co2_level: 370.0,
    precipitation: 1100,
    region: "Asia",
  },
  {
    date: "2001-01-01",
    avg_temp: 23.7,
    co2_level: 371.9,
    precipitation: 1080,
    region: "Asia",
  },
  {
    date: "2002-01-01",
    avg_temp: 24.0,
    co2_level: 374.6,
    precipitation: 1120,
    region: "Asia",
  },
  {
    date: "2003-01-01",
    avg_temp: 23.9,
    co2_level: 377.3,
    precipitation: 1050,
    region: "Asia",
  },
  {
    date: "2004-01-01",
    avg_temp: 24.1,
    co2_level: 379.1,
    precipitation: 1090,
    region: "Asia",
  },
  {
    date: "2005-01-01",
    avg_temp: 24.4,
    co2_level: 381.7,
    precipitation: 1150,
    region: "Asia",
  },
  {
    date: "2006-01-01",
    avg_temp: 24.5,
    co2_level: 383.5,
    precipitation: 1130,
    region: "Asia",
  },
  {
    date: "2007-01-01",
    avg_temp: 24.7,
    co2_level: 385.7,
    precipitation: 1170,
    region: "Asia",
  },
  {
    date: "2008-01-01",
    avg_temp: 24.8,
    co2_level: 387.6,
    precipitation: 1100,
    region: "Asia",
  },
  {
    date: "2009-01-01",
    avg_temp: 25.0,
    co2_level: 389.5,
    precipitation: 1160,
    region: "Asia",
  },
  {
    date: "2010-01-01",
    avg_temp: 25.1,
    co2_level: 392.0,
    precipitation: 1180,
    region: "Asia",
  },

  // South America
  {
    date: "2000-01-01",
    avg_temp: 20.1,
    co2_level: 370.8,
    precipitation: 1250,
    region: "South America",
  },
  {
    date: "2001-01-01",
    avg_temp: 20.3,
    co2_level: 372.7,
    precipitation: 1240,
    region: "South America",
  },
  {
    date: "2002-01-01",
    avg_temp: 20.6,
    co2_level: 375.4,
    precipitation: 1280,
    region: "South America",
  },
  {
    date: "2003-01-01",
    avg_temp: 20.5,
    co2_level: 378.0,
    precipitation: 1200,
    region: "South America",
  },
  {
    date: "2004-01-01",
    avg_temp: 20.7,
    co2_level: 379.8,
    precipitation: 1260,
    region: "South America",
  },
  {
    date: "2005-01-01",
    avg_temp: 21.0,
    co2_level: 382.4,
    precipitation: 1300,
    region: "South America",
  },
  {
    date: "2006-01-01",
    avg_temp: 21.1,
    co2_level: 384.2,
    precipitation: 1290,
    region: "South America",
  },
  {
    date: "2007-01-01",
    avg_temp: 21.3,
    co2_level: 386.4,
    precipitation: 1320,
    region: "South America",
  },
  {
    date: "2008-01-01",
    avg_temp: 21.4,
    co2_level: 388.3,
    precipitation: 1265,
    region: "South America",
  },
  {
    date: "2009-01-01",
    avg_temp: 21.6,
    co2_level: 390.2,
    precipitation: 1295,
    region: "South America",
  },
  {
    date: "2010-01-01",
    avg_temp: 21.7,
    co2_level: 392.7,
    precipitation: 1315,
    region: "South America",
  },

  // Africa
  {
    date: "2000-01-01",
    avg_temp: 26.2,
    co2_level: 370.2,
    precipitation: 800,
    region: "Africa",
  },
  {
    date: "2001-01-01",
    avg_temp: 26.4,
    co2_level: 372.1,
    precipitation: 810,
    region: "Africa",
  },
  {
    date: "2002-01-01",
    avg_temp: 26.7,
    co2_level: 374.8,
    precipitation: 830,
    region: "Africa",
  },
  {
    date: "2003-01-01",
    avg_temp: 26.6,
    co2_level: 377.5,
    precipitation: 780,
    region: "Africa",
  },
  {
    date: "2004-01-01",
    avg_temp: 26.8,
    co2_level: 379.3,
    precipitation: 820,
    region: "Africa",
  },
  {
    date: "2005-01-01",
    avg_temp: 27.1,
    co2_level: 381.9,
    precipitation: 850,
    region: "Africa",
  },
  {
    date: "2006-01-01",
    avg_temp: 27.2,
    co2_level: 383.7,
    precipitation: 840,
    region: "Africa",
  },
  {
    date: "2007-01-01",
    avg_temp: 27.4,
    co2_level: 385.9,
    precipitation: 860,
    region: "Africa",
  },
  {
    date: "2008-01-01",
    avg_temp: 27.5,
    co2_level: 387.8,
    precipitation: 815,
    region: "Africa",
  },
  {
    date: "2009-01-01",
    avg_temp: 27.7,
    co2_level: 389.7,
    precipitation: 835,
    region: "Africa",
  },
  {
    date: "2010-01-01",
    avg_temp: 27.8,
    co2_level: 392.2,
    precipitation: 855,
    region: "Africa",
  },

  // Oceania
  {
    date: "2000-01-01",
    avg_temp: 22.0,
    co2_level: 370.7,
    precipitation: 1000,
    region: "Oceania",
  },
  {
    date: "2001-01-01",
    avg_temp: 22.2,
    co2_level: 372.6,
    precipitation: 990,
    region: "Oceania",
  },
  {
    date: "2002-01-01",
    avg_temp: 22.5,
    co2_level: 375.3,
    precipitation: 1020,
    region: "Oceania",
  },
  {
    date: "2003-01-01",
    avg_temp: 22.4,
    co2_level: 378.0,
    precipitation: 950,
    region: "Oceania",
  },
  {
    date: "2004-01-01",
    avg_temp: 22.6,
    co2_level: 379.7,
    precipitation: 1010,
    region: "Oceania",
  },
  {
    date: "2005-01-01",
    avg_temp: 22.9,
    co2_level: 382.3,
    precipitation: 1050,
    region: "Oceania",
  },
  {
    date: "2006-01-01",
    avg_temp: 23.0,
    co2_level: 384.1,
    precipitation: 1040,
    region: "Oceania",
  },
  {
    date: "2007-01-01",
    avg_temp: 23.2,
    co2_level: 386.3,
    precipitation: 1070,
    region: "Oceania",
  },
  {
    date: "2008-01-01",
    avg_temp: 23.3,
    co2_level: 388.2,
    precipitation: 1005,
    region: "Oceania",
  },
  {
    date: "2009-01-01",
    avg_temp: 23.5,
    co2_level: 390.1,
    precipitation: 1035,
    region: "Oceania",
  },
  {
    date: "2010-01-01",
    avg_temp: 23.6,
    co2_level: 392.6,
    precipitation: 1055,
    region: "Oceania",
  },
];

export function ChartAreaInteractive({ data, loading, error }: Props) {
  if (loading) {
    return <div className="p-4 text-center">Loading charts...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-4 text-center">No data available.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">CO₂ Levels</h2>
        <CO2BarChart data={data} />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Precipitation</h2>
        <PrecipitationAreaChart data={data} />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Temperature</h2>
        <TemperatureLineChart data={climateData} />
      </div>
    </div>
  );
}
