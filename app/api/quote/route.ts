import { NextRequest, NextResponse } from "next/server";
import { fetchQuote } from "@/lib/yahoo";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const range = searchParams.get("range") || "6mo";
  const interval = searchParams.get("interval") || "1d";

  if (!symbol) {
    return NextResponse.json({ error: "Missing 'symbol' query param" }, { status: 400 });
  }

  try {
    const data = await fetchQuote(symbol, range, interval);
    if (!data || data.candles.length === 0) {
      return NextResponse.json({ error: `No data found for '${symbol}'` }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch quote data" }, { status: 500 });
  }
}
