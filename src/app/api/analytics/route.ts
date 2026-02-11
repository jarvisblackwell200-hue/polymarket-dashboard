import { NextResponse } from "next/server";
import {
  getPnlOverTime,
  getWinRateByStrategy,
  getBestWorstTrades,
  getAgentState,
  getTradeCount,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pnlOverTime = getPnlOverTime();
    const winRateByStrategy = getWinRateByStrategy();
    const bestWorst = getBestWorstTrades(5);
    const state = getAgentState();
    const totalTrades = getTradeCount();
    const closedTrades = getTradeCount({ status: "closed" }) + getTradeCount({ status: "resolved" });

    return NextResponse.json({
      pnlOverTime,
      winRateByStrategy,
      bestTrades: bestWorst.best,
      worstTrades: bestWorst.worst,
      state,
      totalTrades,
      closedTrades,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
