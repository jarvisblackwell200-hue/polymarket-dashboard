import { NextResponse } from "next/server";
import { getOpenPositions, getLatestPrices } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const positions = getOpenPositions();
    const marketIds = positions.map((p) => p.market_id);
    const latestPrices = getLatestPrices(marketIds);

    const enriched = positions.map((p) => {
      const latest = latestPrices[p.market_id];
      const currentPrice = latest
        ? p.side === "YES"
          ? latest.yes_price
          : latest.no_price
        : null;
      const unrealizedPnl = currentPrice !== null ? (currentPrice - p.entry_price) * p.size : null;

      return {
        ...p,
        current_price: currentPrice,
        unrealized_pnl: unrealizedPnl,
      };
    });

    return NextResponse.json({ positions: enriched });
  } catch (error) {
    console.error("Positions API error:", error);
    return NextResponse.json({ error: "Failed to fetch positions" }, { status: 500 });
  }
}
