"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUsd, formatDate, formatPrice, pnlColor } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Trade } from "@/lib/db";

interface RecentTradesProps {
  trades: Trade[];
}

export function RecentTrades({ trades }: RecentTradesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {trades.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No trades yet
            </p>
          ) : (
            <div className="space-y-1">
              {trades.map((trade, i) => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        trade.status === "open"
                          ? "bg-blue-400 animate-pulse"
                          : trade.pnl && trade.pnl > 0
                            ? "bg-emerald-400"
                            : "bg-red-400"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {trade.market_question}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 py-0",
                          trade.side === "YES"
                            ? "border-emerald-500/30 text-emerald-400"
                            : "border-red-500/30 text-red-400"
                        )}
                      >
                        {trade.side}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatPrice(trade.entry_price)} &middot; {formatUsd(trade.cost_usd)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    {trade.pnl !== null ? (
                      <span className={cn("text-sm font-mono font-medium", pnlColor(trade.pnl))}>
                        {trade.pnl >= 0 ? "+" : ""}
                        {formatUsd(trade.pnl)}
                      </span>
                    ) : (
                      <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">
                        OPEN
                      </Badge>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatDate(trade.created_at)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
