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
    } catch {
      setError("AI insights temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setInsights(null);
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote.symbol]);

  const isBullish = insights?.sentiment === "Bullish";
  const isBearish = insights?.sentiment === "Bearish";

  return (
    <div className="glass-panel glow-border p-5 animate-fade-in flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent2 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-100 text-sm">AI Technical Intelligence</h3>
              <p className="text-[10px] text-muted">Automated market structure engine</p>
            </div>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="p-1.5 rounded-lg border border-border bg-white/5 hover:bg-white/10 text-muted hover:text-gray-200 transition-colors disabled:opacity-50"
            title="Refresh Analysis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>

        {loading && !insights && (
          <div className="space-y-2.5 py-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-2/3" />
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-4/5" />
          </div>
        )}

        {error && <p className="text-xs text-down py-2">{error}</p>}

        {insights && (
          <>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                  isBullish
                    ? "bg-positive/10 border-positive/30 text-up"
                    : isBearish
                    ? "bg-negative/10 border-negative/30 text-down"
                    : "bg-warning/10 border-warning/30 text-warning"
                }`}
              >
                {isBullish ? <TrendingUp className="w-3.5 h-3.5" /> : isBearish ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                {insights.sentiment} Signal
              </div>
              <span className="text-xs font-mono-num text-muted">Confidence: <strong className="text-gray-200">{insights.confidence}%</strong></span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">{insights.summary}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              <div className="p-3 rounded-xl bg-positive/5 border border-positive/20">
                <p className="text-[10px] uppercase tracking-wider text-up font-bold mb-1.5">Bullish Drivers</p>
                <ul className="space-y-1">
                  {insights.bullPoints?.map((p, i) => (
                    <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                      <span className="text-up font-bold">+</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-negative/5 border border-negative/20">
                <p className="text-[10px] uppercase tracking-wider text-down font-bold mb-1.5">Risk Factors</p>
                <ul className="space-y-1">
                  {insights.bearPoints?.map((p, i) => (
                    <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                      <span className="text-down font-bold">−</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>

      <p className="text-[10px] text-muted mt-3 italic border-t border-border/40 pt-2">
        Educational technical commentary — verify signals before placing live market trades.
      </p>
    </div>
  );
}
