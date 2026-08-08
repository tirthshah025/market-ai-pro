"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { QuoteData } from "@/lib/types";

interface Insights {
  sentiment: "Bullish" | "Bearish" | "Neutral";
  confidence: number;
  summary: string;
  bullPoints: string[];
  bearPoints: string[];
}

const sentimentStyle: Record<string, { color: string; icon: JSX.Element; ring: string }> = {
  Bullish: { color: "text-up", icon: <TrendingUp className="w-4 h-4" />, ring: "ring-up/30" },
  Bearish: { color: "text-down", icon: <TrendingDown className="w-4 h-4" />, ring: "ring-down/30" },
  Neutral: { color: "text-amber-400", icon: <Minus className="w-4 h-4" />, ring: "ring-amber-400/30" },
};

export default function InsightsCard({ quote }: { quote: QuoteData }) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const lastCandle = quote.candles[quote.candles.length - 1];
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: quote.symbol,
          name: quote.shortName,
          price: quote.regularMarketPrice,
          changePercent: quote.regularMarketChangePercent,
          dayHigh: quote.regularMarketDayHigh,
          dayLow: quote.regularMarketDayLow,
          fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
          fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
          sma20: lastCandle?.sma20,
          sma50: lastCandle?.sma50,
          volume: quote.regularMarketVolume,
          sector: quote.sector,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInsights(data);
    } catch (e: any) {
      setError("AI insights unavailable — check ANTHROPIC_API_KEY is set.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setInsights(null);
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote.symbol]);

  const style = insights ? sentimentStyle[insights.sentiment] || sentimentStyle.Neutral : null;

  return (
    <div className="glass-panel glow-border p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent2" />
          <h3 className="font-semibold text-gray-100 text-sm">AI Insight</h3>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="text-muted hover:text-gray-200 transition-colors"
          title="Regenerate"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading && !insights && (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-3 bg-white/10 rounded w-5/6" />
        </div>
      )}

      {error && <p className="text-xs text-down">{error}</p>}

      {insights && style && (
        <>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${style.ring} ${style.color} text-xs font-semibold mb-3`}>
            {style.icon}
            {insights.sentiment} · {insights.confidence}% confidence
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">{insights.summary}</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-up mb-1.5 font-semibold">Bull Case</p>
              <ul className="space-y-1">
                {insights.bullPoints?.map((p, i) => (
                  <li key={i} className="text-xs text-gray-400 flex gap-1.5">
                    <span className="text-up">+</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-down mb-1.5 font-semibold">Bear Case</p>
              <ul className="space-y-1">
                {insights.bearPoints?.map((p, i) => (
                  <li key={i} className="text-xs text-gray-400 flex gap-1.5">
                    <span className="text-down">−</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-[10px] text-muted mt-4 italic">AI-generated technical commentary — not financial advice.</p>
        </>
      )}
    </div>
  );
}
