"use client";

import { StatCard } from "./stat-card";
import { ExposureChart } from "./exposure-chart";
import { RecentTrades } from "./recent-trades";
import { formatUsd } from "@/lib/format";
import { Wallet, TrendingUp, AlertTriangle, BarChart3, DollarSign } from "lucide-react";
import type { Trade } from "@/lib/db";

interface OverviewData {
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
}

interface OverviewTabProps {
  data: OverviewData;
}

export function OverviewTab({ data }: OverviewTabProps) {
  const { state, exposure, openCount, closedCount, exposureByStrategy, recentTrades } = data;
  const bankroll = state?.bankroll ?? 0;
  const totalPnl = state?.total_pnl ?? 0;
  const apiCost = state?.total_api_cost ?? 0;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          title="Bankroll"
          value={formatUsd(bankroll)}
          icon={Wallet}
          accentColor="text-blue-400"
          delay={0}
        />
        <StatCard
          title="Total P&L"
          value={formatUsd(totalPnl)}
          icon={TrendingUp}
          trend={totalPnl > 0 ? "up" : totalPnl < 0 ? "down" : "neutral"}
          subtitle={bankroll > 0 ? `${((totalPnl / bankroll) * 100).toFixed(1)}% ROI` : undefined}
          accentColor={totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}
          delay={0.05}
        />
        <StatCard
          title="Exposure"
          value={formatUsd(exposure)}
          subtitle={`${openCount} open position${openCount !== 1 ? "s" : ""}`}
          icon={AlertTriangle}
          accentColor="text-amber-400"
          delay={0.1}
        />
        <StatCard
          title="Trades"
          value={`${openCount + closedCount}`}
          subtitle={`${closedCount} closed`}
          icon={BarChart3}
          accentColor="text-purple-400"
          delay={0.15}
        />
        <StatCard
          title="API Cost"
          value={formatUsd(apiCost)}
          icon={DollarSign}
          accentColor="text-cyan-400"
          delay={0.2}
        />
      </div>

      {/* Charts + Recent */}
      <div className="grid lg:grid-cols-2 gap-4">
        <ExposureChart data={exposureByStrategy} />
        <RecentTrades trades={recentTrades} />
      </div>
    </div>
  );
}
