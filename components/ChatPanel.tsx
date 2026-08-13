"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Loader2, MessageSquareText, Sparkles } from "lucide-react";
import { ChatMessage, QuoteData } from "@/lib/types";

export default function ChatPanel({ quote }: { quote: QuoteData | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I am your AI Market Research Assistant. Ask me about stock technicals, RSI, moving averages, or Indian equity market concepts.",
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
      setMessages([...newMessages, { role: "assistant", content: data.reply || data.error || "Unable to generate response." }]);
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
    <div className="glass-panel glow-border flex flex-col h-[580px] animate-fade-in">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border bg-panel2/40">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent2 flex items-center justify-center">
          <MessageSquareText className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-100 text-sm flex items-center gap-1.5">
            AI Research Assistant <Sparkles className="w-3 h-3 text-accent2" />
          </h3>
          <p className="text-[10px] text-muted">Real-time financial chat & analysis</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center ${
                m.role === "user" ? "bg-primary/20 border border-primary/30" : "bg-accent2/20 border border-accent2/30"
              }`}
            >
              {m.role === "user" ? <User className="w-3.5 h-3.5 text-primary" /> : <Bot className="w-3.5 h-3.5 text-accent2" />}
            </div>
            <div
              className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary/15 border border-primary/25 text-gray-100"
                  : "bg-panel2 border border-border/60 text-gray-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 shrink-0 rounded-full bg-accent2/20 border border-accent2/30 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-accent2" />
            </div>
            <div className="bg-panel2 border border-border/60 rounded-2xl px-3.5 py-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-border/60 hover:bg-primary/10 hover:border-primary/30 text-gray-300 transition-colors"
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
        className="flex items-center gap-2 p-3 border-t border-border bg-panel2/30"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about technical indicators or market trends..."
          className="flex-1 input-field text-xs sm:text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-primary to-accent2 flex items-center justify-center
                     disabled:opacity-40 hover:shadow-glow transition-all"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>
    </div>
  );
}
