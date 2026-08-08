import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface InsightsBody {
  symbol: string;
  name?: string;
  price: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  sma20?: number;
  sma50?: number;
  volume?: number;
  sector?: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const body: InsightsBody = await req.json();

  const prompt = `Analyze this stock snapshot and produce a JSON object only (no markdown fences, no preamble) with this exact shape:
{
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "confidence": <number 0-100>,
  "summary": "<2-3 sentence plain-English summary of what the data suggests>",
  "bullPoints": ["<short point>", "<short point>"],
  "bearPoints": ["<short point>", "<short point>"]
}

Stock data:
Symbol: ${body.symbol} (${body.name || ""})
Sector: ${body.sector || "N/A"}
Current Price: ${body.price}
Change Today: ${body.changePercent?.toFixed(2)}%
Day Range: ${body.dayLow} - ${body.dayHigh}
52-Week Range: ${body.fiftyTwoWeekLow ?? "N/A"} - ${body.fiftyTwoWeekHigh ?? "N/A"}
SMA20: ${body.sma20?.toFixed(2) ?? "N/A"}
SMA50: ${body.sma50?.toFixed(2) ?? "N/A"}
Volume: ${body.volume ?? "N/A"}

Base the sentiment purely on the technical/price data given (trend vs moving averages, position in 52-week range, day change). This is educational technical commentary, not investment advice — keep tone analytical and neutral.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Claude API error: ${errText}` }, { status: 502 });
    }

    const data = await res.json();
    const raw = data.content?.find((c: any) => c.type === "text")?.text || "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        sentiment: "Neutral",
        confidence: 50,
        summary: raw.slice(0, 300),
        bullPoints: [],
        bearPoints: [],
      };
    }

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: "Failed to reach Claude API" }, { status: 500 });
  }
}
