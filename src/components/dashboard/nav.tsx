"use client";

import { cn } from "@/lib/utils";
import { StatusPulse } from "./status-pulse";
import { BarChart3, Crosshair, History, TrendingUp } from "lucide-react";

interface NavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAlive: boolean;
  lastUpdated: string | null;
}

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "positions", label: "Positions", icon: Crosshair },
  { id: "history", label: "History", icon: History },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
];

export function Nav({ activeTab, onTabChange, isAlive, lastUpdated }: NavProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Polymarket Bot</h1>
              <div className="hidden sm:block">
                <StatusPulse isAlive={isAlive} />
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-white/10 text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {lastUpdated && (
            <p className="hidden sm:block text-[10px] text-muted-foreground">
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex border-t border-border/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-all",
              activeTab === tab.id
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-muted-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
