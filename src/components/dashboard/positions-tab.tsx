"use client";

import { useFetch } from "@/hooks/use-fetch";
import { PositionCard } from "./position-card";
import { PriceChart } from "./price-chart";
import { Crosshair, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Position {
  id: number;
  strategy: string;
  market_id: string;
  market_question: string;
  side: "YES" | "NO";
  entry_price: number;
  size: number;
  cost_usd: number;
  edge: number;
  fair_value_estimate: number;
  created_at: string;
  current_price: number | null;
  unrealized_pnl: number | null;
}

interface PriceData {
  recorded_at: string;
  yes_price: number;
  no_price: number;
}

export function PositionsTab() {
  const { data, loading } = useFetch<{ positions: Position[] }>("/api/positions", 30000);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const positions = data?.positions ?? [];

  if (positions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-muted-foreground"
      >
        <Crosshair className="h-12 w-12 mb-3 opacity-30" />
        <p className="text-sm font-medium">No open positions</p>
        <p className="text-xs mt-1">Positions will appear here when the bot opens trades</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {positions.map((pos, i) => (
          <PositionCard key={pos.id} position={pos} index={i} />
        ))}
      </div>

      {/* Price charts for each position */}
      <div className="grid sm:grid-cols-2 gap-4">
        {positions.map((pos) => (
          <PositionPriceChart
            key={`chart-${pos.id}`}
            marketId={pos.market_id}
            title={pos.market_question}
          />
        ))}
      </div>
    </div>
  );
}

function PositionPriceChart({ marketId, title }: { marketId: string; title: string }) {
  const { data } = useFetch<{ prices: PriceData[] }>(
    `/api/prices?marketId=${marketId}&limit=100`,
    30000
  );

  if (!data?.prices?.length) return null;

  return <PriceChart data={data.prices} title={title} />;
}
