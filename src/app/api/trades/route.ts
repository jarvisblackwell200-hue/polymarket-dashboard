import { NextRequest, NextResponse } from "next/server";
import { getTrades, getTradeCount, getStrategies } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") || undefined;
    const strategy = searchParams.get("strategy") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const [trades, total, strategies] = await Promise.all([
      getTrades({ status, strategy, limit, offset }),
      getTradeCount({ status, strategy }),
      getStrategies(),
    ]);

    return NextResponse.json({ trades, total, strategies });
  } catch (error) {
    console.error("Trades API error:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}
