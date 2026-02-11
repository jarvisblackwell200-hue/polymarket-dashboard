"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUsd, formatPrice, formatRelativeTime, pnlColor, pnlBgColor } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

interface Position {
  id: number;
  strategy: string;
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

interface PositionCardProps {
  position: Position;
  index: number;
}

export function PositionCard({ position, index }: PositionCardProps) {
  const isProfitable = position.unrealized_pnl !== null && position.unrealized_pnl > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className={cn(
          "border transition-all hover:scale-[1.01]",
          pnlBgColor(position.unrealized_pnl)
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-medium uppercase",
                position.side === "YES"
                  ? "border-emerald-500/30 text-emerald-400"
                  : "border-red-500/30 text-red-400"
              )}
            >
              {position.side}
            </Badge>
            <Badge variant="outline" className="text-[10px] capitalize border-border/50">
              {position.strategy.replace(/_/g, " ")}
            </Badge>
          </div>

          <h3 className="text-sm font-semibold leading-snug mb-4 line-clamp-2">
            {position.market_question}
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Entry</span>
              <p className="font-mono font-medium mt-0.5">
                {formatPrice(position.entry_price)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Current</span>
              <p className="font-mono font-medium mt-0.5">
                {position.current_price !== null
                  ? formatPrice(position.current_price)
                  : "—"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Size</span>
              <p className="font-mono font-medium mt-0.5">
                {position.size.toFixed(2)} @ {formatUsd(position.cost_usd)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Edge</span>
              <p className="font-mono font-medium mt-0.5">
                {(position.edge * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(position.created_at)}
            </div>
            {position.unrealized_pnl !== null && (
              <div className={cn("flex items-center gap-1 text-sm font-mono font-bold", pnlColor(position.unrealized_pnl))}>
                {isProfitable ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {position.unrealized_pnl >= 0 ? "+" : ""}
                {formatUsd(position.unrealized_pnl)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
