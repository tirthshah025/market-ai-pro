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

function generateAlgorithmicInsights(body: InsightsBody) {
  const { symbol, name, price, changePercent, dayHigh, dayLow, fiftyTwoWeekHigh, fiftyTwoWeekLow, sma20, sma50, sector } = body;
  const displayName = name || symbol;
  const isUp = changePercent >= 0;

  let bullPoints: string[] = [];
  let bearPoints: string[] = [];
  let score = 50;

  if (sma20 && price > sma20) {
    score += 15;
    bullPoints.push(`Trading above 20-day Moving Average (₹${sma20.toFixed(2)}), signaling short-term strength.`);
  } else if (sma20 && price <= sma20) {
    score -= 15;
    bearPoints.push(`Price is below 20-day Moving Average (₹${sma20.toFixed(2)}), indicating short-term momentum weakness.`);
  }

  if (sma50 && price > sma50) {
    score += 15;
    bullPoints.push(`Holding above 50-day Moving Average (₹${sma50.toFixed(2)}), reinforcing medium-term uptrend.`);
  } else if (sma50 && price <= sma50) {
    score -= 15;
    bearPoints.push(`Trading below 50-day Moving Average (₹${sma50.toFixed(2)}), pointing to potential consolidation.`);
  }

  if (fiftyTwoWeekHigh && fiftyTwoWeekLow && fiftyTwoWeekHigh > fiftyTwoWeekLow) {
    const rangePct = ((price - fiftyTwoWeekLow) / (fiftyTwoWeekHigh - fiftyTwoWeekLow)) * 100;
    if (rangePct > 75) {
      score += 10;
      bullPoints.push(`Positioned near upper bound of 52-week range (${rangePct.toFixed(0)}% percentile).`);
    } else if (rangePct < 25) {
      score -= 10;
      bearPoints.push(`Trading near lower end of 52-week price range (${rangePct.toFixed(0)}% percentile).`);
    }
  }

  if (changePercent > 1.5) {
    score += 10;
    bullPoints.push(`Strong daily price expansion of +${changePercent.toFixed(2)}%.`);
  } else if (changePercent < -1.5) {
    score -= 10;
    bearPoints.push(`Daily pullback of ${changePercent.toFixed(2)}% reflects overhead selling pressure.`);
  }

  if (bullPoints.length === 0) {
    bullPoints.push(`Stable baseline market structure across recent sessions.`);
    bullPoints.push(`Resilient liquidity profile within the ${sector || "equity"} space.`);
  }
  if (bearPoints.length === 0) {
    bearPoints.push(`Short-term volatility could limit rapid upside continuation.`);
    bearPoints.push(`Needs volume confirmation for sustained breakout above current resistance.`);
  }

  score = Math.max(15, Math.min(92, score));
  const sentiment: "Bullish" | "Bearish" | "Neutral" = score > 60 ? "Bullish" : score < 40 ? "Bearish" : "Neutral";

  const summary = `${displayName} is currently showing a ${sentiment.toLowerCase()} technical posture at ₹${price.toFixed(
    2
  )} (${isUp ? "+" : ""}${changePercent.toFixed(
    2
  )}% today). Key technical indicators reflect ${sentiment === "Bullish" ? "constructive momentum above key moving averages" : sentiment === "Bearish" ? "heightened selling pressure and corrective consolidation" : "range-bound price action awaiting directional catalyst"}.`;

  return {
    sentiment,
    confidence: Math.round(score),
    summary,
    bullPoints: bullPoints.slice(0, 3),
    bearPoints: bearPoints.slice(0, 3),
  };
}

export async function POST(req: NextRequest) {
  const body: InsightsBody = await req.json();

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (anthropicKey) {
    try {
      const prompt = `Analyze this stock snapshot and produce a JSON object only (no markdown, no preamble) with this shape:
{"sentiment": "Bullish" | "Bearish" | "Neutral", "confidence": number, "summary": "string", "bullPoints": ["str"], "bearPoints": ["str"]}
Stock: ${body.symbol} (${body.name || ""}), Sector: ${body.sector || "N/A"}, Price: ${body.price}, Change: ${body.changePercent}%, SMA20: ${body.sma20}, SMA50: ${body.sma50}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.content?.find((c: any) => c.type === "text")?.text || "";
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return NextResponse.json(parsed);
      }
    } catch {
      // Fall through to algorithmic generator if API call fails
    }
  } else if (geminiKey) {
    try {
      const prompt = `Analyze stock snapshot and reply with JSON only: {"sentiment":"Bullish"|"Bearish"|"Neutral","confidence":number,"summary":"string","bullPoints":["str"],"bearPoints":["str"]}. Data: ${body.symbol} Price:${body.price} Change:${body.changePercent}% SMA20:${body.sma20}`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      if (res.ok) {
        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return NextResponse.json(parsed);
      }
    } catch {
      // Fall through
    }
  }

  // Built-in intelligent algorithmic fallback
  const fallback = generateAlgorithmicInsights(body);
  return NextResponse.json(fallback);
}
