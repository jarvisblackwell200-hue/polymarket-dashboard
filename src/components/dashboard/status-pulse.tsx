"use client";

import { cn } from "@/lib/utils";

interface StatusPulseProps {
  isAlive: boolean;
}

export function StatusPulse({ isAlive }: StatusPulseProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={cn(
            "w-2.5 h-2.5 rounded-full",
            isAlive ? "bg-emerald-400" : "bg-red-400"
          )}
        />
        {isAlive && (
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
        )}
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {isAlive ? "Bot Active" : "Bot Offline"}
      </span>
    </div>
  );
}
