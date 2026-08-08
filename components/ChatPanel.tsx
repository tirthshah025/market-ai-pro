"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Loader2, MessageSquareText } from "lucide-react";
import { ChatMessage, QuoteData } from "@/lib/types";

export default function ChatPanel({ quote }: { quote: QuoteData | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm your market research assistant. Ask me anything about the stock you're viewing, technical indicators, or general market concepts.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: quote
            ? {
                symbol: quote.symbol,
                price: quote.regularMarketPrice,
                changePercent: quote.regularMarketChangePercent,
                sector: quote.sector,
              }
            : undefined,
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || data.error || "Something went wrong." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Network error — please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = quote
    ? [`What's driving ${quote.symbol} today?`, `Explain RSI vs MACD`, `Is ${quote.symbol} overbought right now?`]
    : ["What is a moving average?", "Explain candlestick patterns", "What does RSI measure?"];

  return (
    <div className="glass-panel glow-border flex flex-col h-[560px]">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center">
          <MessageSquareText className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-100 text-sm">AI Research Assistant</h3>
          <p className="text-[11px] text-muted">Powered by Claude</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center ${
                m.role === "user" ? "bg-accent/20" : "bg-accent2/20"
              }`}
            >
              {m.role === "user" ? <User className="w-3.5 h-3.5 text-accent" /> : <Bot className="w-3.5 h-3.5 text-accent2" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user" ? "bg-accent/15 text-gray-100" : "bg-white/5 text-gray-300"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 shrink-0 rounded-full bg-accent2/20 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-accent2" />
            </div>
            <div className="bg-white/5 rounded-2xl px-3.5 py-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-muted" />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-[11px] px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 p-3 border-t border-border"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this stock or the market..."
          className="flex-1 bg-panel2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-gray-100
                     placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center
                     disabled:opacity-40 hover:shadow-glow transition-all"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
}
