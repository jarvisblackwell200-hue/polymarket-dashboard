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
    const [pnlOverTime, winRateByStrategy, bestWorst, state, totalTrades, closedCount, resolvedCount] =
      await Promise.all([
        getPnlOverTime(),
        getWinRateByStrategy(),
        getBestWorstTrades(5),
        getAgentState(),
        getTradeCount(),
        getTradeCount({ status: "closed" }),
        getTradeCount({ status: "resolved" }),
      ]);

    return NextResponse.json({
      pnlOverTime,
      winRateByStrategy,
      bestTrades: bestWorst.best,
      worstTrades: bestWorst.worst,
      state,
      totalTrades,
      closedTrades: closedCount + resolvedCount,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
