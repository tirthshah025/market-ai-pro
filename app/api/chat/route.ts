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

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const body: ChatBody = await req.json();
  const { messages, context } = body;

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const systemPrompt = `You are a sharp, concise financial markets assistant embedded inside a stock analytics dashboard called MarketAI Pro.
${context?.symbol ? `The user is currently viewing: ${context.symbol} at $${context.price} (${context.changePercent?.toFixed(2)}% today), sector: ${context.sector || "N/A"}.` : ""}
Answer questions about stocks, technical indicators, market concepts, and general strategy clearly and briefly (3-6 sentences unless asked for more detail).
Always remind the user, when giving anything resembling advice, that this is educational information and not financial advice — but do this naturally, not as a repeated disclaimer every message.
Never fabricate specific real-time prices you were not given; if you don't have live data for something, say so.`;

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
        max_tokens: 600,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Claude API error: ${errText}` }, { status: 502 });
    }

    const data = await res.json();
    const text = data.content
      ?.filter((c: any) => c.type === "text")
      .map((c: any) => c.text)
      .join("\n") || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply: text });
  } catch (err) {
    return NextResponse.json({ error: "Failed to reach Claude API" }, { status: 500 });
  }
}
