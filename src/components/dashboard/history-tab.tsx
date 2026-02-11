"use client";

import { useState, useEffect, useCallback } from "react";
import { TradeTable } from "./trade-table";
import { Loader2 } from "lucide-react";
import type { Trade } from "@/lib/db";

export function HistoryTab() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [strategyFilter, setStrategyFilter] = useState("");

  const fetchTrades = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (strategyFilter) params.set("strategy", strategyFilter);
    params.set("limit", "100");

    try {
      const res = await fetch(`/api/trades?${params}`);
      const data = await res.json();
      setTrades(data.trades);
      setStrategies(data.strategies);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [statusFilter, strategyFilter]);

  useEffect(() => {
    fetchTrades();
    const interval = setInterval(fetchTrades, 30000);
    return () => clearInterval(interval);
  }, [fetchTrades]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-card/50 border border-border/50 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/50"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={strategyFilter}
          onChange={(e) => setStrategyFilter(e.target.value)}
          className="bg-card/50 border border-border/50 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/50"
        >
          <option value="">All Strategies</option>
          {strategies.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <TradeTable trades={trades} />
      )}
    </div>
  );
}
