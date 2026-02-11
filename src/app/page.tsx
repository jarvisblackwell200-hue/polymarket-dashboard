"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { Nav } from "@/components/dashboard/nav";
import { OverviewTab } from "@/components/dashboard/overview-tab";
import { PositionsTab } from "@/components/dashboard/positions-tab";
import { HistoryTab } from "@/components/dashboard/history-tab";
import { AnalyticsTab } from "@/components/dashboard/analytics-tab";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Trade } from "@/lib/db";

interface DashboardData {
  state: {
    bankroll: number;
    total_pnl: number;
    total_api_cost: number;
    is_alive: number;
    updated_at: string;
  } | null;
  exposure: number;
  openCount: number;
  closedCount: number;
  exposureByStrategy: { strategy: string; exposure: number }[];
  recentTrades: Trade[];
  strategies: string[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data, loading } = useFetch<DashboardData>("/api/dashboard", 30000);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full max-w-[100vw]">
      <Nav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAlive={data?.state?.is_alive === 1}
        lastUpdated={data?.state?.updated_at ?? null}
      />
      <main className="max-w-7xl mx-auto px-4 py-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {activeTab === "overview" && data && <OverviewTab data={data} />}
            {activeTab === "positions" && <PositionsTab />}
            {activeTab === "history" && <HistoryTab />}
            {activeTab === "analytics" && <AnalyticsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
