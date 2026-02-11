"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatUsd, formatDate, formatPrice, pnlColor } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Trade } from "@/lib/db";

interface TradeTableProps {
  trades: Trade[];
  title?: string;
}

export function TradeTable({ trades, title = "Trade History" }: TradeTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="text-[11px] text-muted-foreground uppercase">Market</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground uppercase">Strategy</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground uppercase">Side</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground uppercase text-right">Entry</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground uppercase text-right">Exit</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground uppercase text-right">Cost</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground uppercase text-right">P&L</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground uppercase">Status</TableHead>
                  <TableHead className="text-[11px] text-muted-foreground uppercase text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id} className="border-border/20 hover:bg-white/[0.02]">
                    <TableCell className="max-w-[200px] truncate text-xs font-medium">
                      {trade.market_question}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize border-border/50">
                        {trade.strategy.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          trade.side === "YES"
                            ? "border-emerald-500/30 text-emerald-400"
                            : "border-red-500/30 text-red-400"
                        )}
                      >
                        {trade.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {formatPrice(trade.entry_price)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {trade.exit_price !== null ? formatPrice(trade.exit_price) : "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {formatUsd(trade.cost_usd)}
                    </TableCell>
                    <TableCell className={cn("text-right font-mono text-xs font-medium", pnlColor(trade.pnl))}>
                      {trade.pnl !== null
                        ? `${trade.pnl >= 0 ? "+" : ""}${formatUsd(trade.pnl)}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          trade.status === "open"
                            ? "border-blue-500/30 text-blue-400"
                            : trade.status === "closed"
                              ? "border-muted-foreground/30 text-muted-foreground"
                              : "border-purple-500/30 text-purple-400"
                        )}
                      >
                        {trade.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(trade.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {trades.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">No trades found</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
