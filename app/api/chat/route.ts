import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface ChatBody {
  messages: { role: "user" | "assistant"; content: string }[];
  context?: {
    symbol?: string;
    price?: number;
    changePercent?: number;
    sector?: string;
  };
}

function generateAlgorithmicChatResponse(query: string, context?: ChatBody["context"]): string {
  const q = query.toLowerCase();
  const sym = context?.symbol || "the market";
  const price = context?.price ? `₹${context.price.toFixed(2)}` : "";
  const change = context?.changePercent != null ? `${context.changePercent >= 0 ? "+" : ""}${context.changePercent.toFixed(2)}%` : "";

  if (q.includes("driving") || q.includes("why") || q.includes("going up") || q.includes("going down")) {
    return `Price movement for ${sym} (${price} ${change}) is driven by recent earnings sentiment, sectoral momentum in ${context?.sector || "the market"}, and overall institutional participation. Keep an eye on volume levels and key moving averages (20-day & 50-day SMA) for breakout confirmation. Note: This is technical commentary and not financial advice.`;
  }

  if (q.includes("rsi") || q.includes("macd") || q.includes("indicator")) {
    return `Technical Indicators Primer:\n• **RSI (Relative Strength Index)**: Measures momentum on a 0–100 scale. Below 30 indicates oversold conditions, while above 70 indicates overbought territory.\n• **MACD (Moving Average Convergence Divergence)**: Tracks momentum trend shifts. A bullish crossover happens when the MACD line crosses above the signal line.`;
  }

  if (q.includes("overbought") || q.includes("oversold")) {
    return `Evaluating whether ${sym} is overbought requires cross-referencing daily RSI and price distance from its 20-day SMA. With today's movement of ${change}, monitor if price approaches upper Bollinger Bands or historic resistance zones.`;
  }

  if (q.includes("moving average") || q.includes("sma") || q.includes("ema")) {
    return `Moving averages smooth out price action to reveal underlying trends:\n• **20-day SMA**: Ideal for short-term trend & dynamic support.\n• **50-day & 200-day SMA**: Key institutional benchmarks for medium and long-term trend direction.`;
  }

  return `MarketAI Pro Assistant: Regarding your inquiry on ${sym}${price ? ` (${price})` : ""}, Indian equity markets continue to balance quarterly earnings execution with macro liquidity signals. Analyzing volume trends alongside support/resistance levels offers clear setup confirmation. Feel free to ask about specific indicators like RSI, moving averages, or sector rotation!`;
}

export async function POST(req: NextRequest) {
  const body: ChatBody = await req.json();
  const { messages, context } = body;

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const userQuery = messages[messages.length - 1]?.content || "";
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const systemPrompt = `You are MarketAI Pro Assistant, an expert financial analyst for Indian equity markets.
${context?.symbol ? `Current stock context: ${context.symbol} at ${context.price} INR (${context.changePercent}% today), Sector: ${context.sector || "N/A"}.` : ""}
Provide clear, analytical, 3-5 sentence answers. Keep commentary objective, professional, and educational.`;

  if (anthropicKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 600,
          system: systemPrompt,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.filter((c: any) => c.type === "text").map((c: any) => c.text).join("\n") || "";
        return NextResponse.json({ reply: text });
      }
    } catch {
      // Fall through to fallback
    }
  } else if (geminiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\nUser Question: ${userQuery}` }] }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        return NextResponse.json({ reply: text });
      }
    } catch {
      // Fall through
    }
  }

  // Built-in intelligent algorithmic response
  const reply = generateAlgorithmicChatResponse(userQuery, context);
  return NextResponse.json({ reply });
}
