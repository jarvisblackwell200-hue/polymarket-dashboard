"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  accentColor?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = "text-blue-400",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-colors">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {title}
              </p>
              <p className={cn("text-2xl font-bold tracking-tight", accentColor)}>
                {value}
              </p>
              {subtitle && (
                <p
                  className={cn(
                    "text-xs font-medium",
                    trend === "up"
                      ? "text-emerald-400"
                      : trend === "down"
                        ? "text-red-400"
                        : "text-muted-foreground"
                  )}
                >
                  {trend === "up" && "▲ "}
                  {trend === "down" && "▼ "}
                  {subtitle}
                </p>
              )}
            </div>
            <div
              className={cn(
                "p-2.5 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02]",
                "border border-white/[0.06]"
              )}
            >
              <Icon className={cn("h-5 w-5", accentColor)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
