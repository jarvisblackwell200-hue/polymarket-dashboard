"use client";

import { useFetch } from "@/hooks/use-fetch";
import { PnlChart } from "./pnl-chart";
import { WinRateChart } from "./win-rate-chart";
import { TradeTable } from "./trade-table";
import { StatCard } from "./stat-card";
import { Loader2, Trophy, Target, Zap } from "lucide-react";
import { formatUsd } from "@/lib/format";
import type { Trade } from "@/lib/db";

interface AnalyticsData {
  pnlOverTime: { date: string; pnl: number; cumulative_pnl: number }[];
  winRateByStrategy: {
    strategy: string;
    wins: number;
    losses: number;
    total: number;
    win_rate: number;
  }[];
  bestTrades: Trade[];
  worstTrades: Trade[];
  state: { bankroll: number; total_pnl: number } | null;
  totalTrades: number;
  closedTrades: number;
}

export function AnalyticsTab() {
  const { data, loading } = useFetch<AnalyticsData>("/api/analytics", 30000);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const avgPnl =
    data.closedTrades > 0 && data.state
      ? data.state.total_pnl / data.closedTrades
      : 0;

  const overallWinRate =
    data.winRateByStrategy.length > 0
      ? data.winRateByStrategy.reduce((acc, s) => acc + s.wins, 0) /
        Math.max(data.winRateByStrategy.reduce((acc, s) => acc + s.total, 0), 1) *
        100
      : 0;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          title="Win Rate"
          value={data.closedTrades > 0 ? `${overallWinRate.toFixed(1)}%` : "—"}
          icon={Target}
          accentColor="text-blue-400"
          delay={0}
        />
        <StatCard
          title="Avg P&L / Trade"
          value={data.closedTrades > 0 ? formatUsd(avgPnl) : "—"}
          icon={Zap}
          accentColor={avgPnl >= 0 ? "text-emerald-400" : "text-red-400"}
          delay={0.05}
        />
        <StatCard
          title="Best Trade"
          value={
            data.bestTrades.length > 0 && data.bestTrades[0].pnl !== null
              ? formatUsd(data.bestTrades[0].pnl)
              : "—"
          }
          icon={Trophy}
          accentColor="text-amber-400"
          delay={0.1}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <PnlChart data={data.pnlOverTime} />
        <WinRateChart data={data.winRateByStrategy} />
      </div>

      {/* Best/Worst trades */}
      {data.bestTrades.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-4">
          <TradeTable trades={data.bestTrades} title="Best Trades" />
          <TradeTable trades={data.worstTrades} title="Worst Trades" />
        </div>
      )}
    </div>
  );
}
