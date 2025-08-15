"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { ChartAreaInteractive } from "@/components/dashboard/ChartAreaInteractive";
import { DataTable } from "@/components/dashboard/DataTable";
import { SectionCards } from "@/components/dashboard/SectionCards";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { useAuthStore } from "@/features/auth/store";

type ClimateData = {
  id: number;
  year: number;
  region: string;
  avg_temp: number;
  co2_level: number;
  precipitation: number;
};

export default function Dashboard() {
  const { token } = useAuthStore();

  const [climateData, setClimateData] = useState<ClimateData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/climate", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClimateData(res.data);
    } catch (err) {
      setError("Failed to load climate data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={climateData} loading={loading} error={error} />
              </div>
              {/* <DataTable data={climateData} loading={loading} error={error} /> */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
