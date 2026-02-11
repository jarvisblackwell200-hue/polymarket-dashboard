import { NextRequest, NextResponse } from "next/server";
import { getPriceHistory } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const marketId = searchParams.get("marketId");

    if (!marketId) {
      return NextResponse.json({ error: "marketId is required" }, { status: 400 });
    }

    const limit = parseInt(searchParams.get("limit") || "200");
    const prices = getPriceHistory(marketId, limit);

    return NextResponse.json({ prices });
  } catch (error) {
    console.error("Prices API error:", error);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
