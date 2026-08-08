"use client";

import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { QuoteData } from "@/lib/types";

function fmtLarge(n?: number) {
  if (n == null) return "N/A";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  return n.toLocaleString();
}

export default function PriceStats({
  quote,
  onToggleWatch,
  isWatched,
}: {
  quote: QuoteData;
  onToggleWatch: () => void;
  isWatched: boolean;
}) {
  const isUp = quote.regularMarketChange >= 0;

  return (
    <div className="glass-panel glow-border p-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-100">{quote.shortName || quote.symbol}</h2>
            <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded-md font-mono-num">{quote.symbol}</span>
            <button onClick={onToggleWatch} title="Toggle watchlist">
              <Star className={`w-4 h-4 transition-colors ${isWatched ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
            </button>
          </div>
          <p className="text-xs text-muted mt-1">
            {quote.exchange} {quote.sector ? `· ${quote.sector}` : ""} {quote.industry ? `· ${quote.industry}` : ""}
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold font-mono-num text-gray-100">
            {quote.currency === "INR" ? "₹" : "$"}
            {quote.regularMarketPrice?.toFixed(2)}
          </div>
          <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${isUp ? "text-up" : "text-down"}`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isUp ? "+" : ""}
            {quote.regularMarketChange?.toFixed(2)} ({isUp ? "+" : ""}
            {quote.regularMarketChangePercent?.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          ["Open", quote.regularMarketOpen?.toFixed(2)],
          ["Day High", quote.regularMarketDayHigh?.toFixed(2)],
          ["Day Low", quote.regularMarketDayLow?.toFixed(2)],
          ["Prev Close", quote.regularMarketPreviousClose?.toFixed(2)],
          ["Market Cap", fmtLarge(quote.marketCap)],
          ["Volume", fmtLarge(quote.regularMarketVolume)],
          ["52W High", quote.fiftyTwoWeekHigh?.toFixed(2) ?? "N/A"],
          ["52W Low", quote.fiftyTwoWeekLow?.toFixed(2) ?? "N/A"],
          ["P/E Ratio", quote.trailingPE?.toFixed(2) ?? "N/A"],
        ].map(([label, value]) => (
          <div key={label} className="bg-panel2 border border-border rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted mb-1">{label}</p>
            <p className="text-sm font-semibold font-mono-num text-gray-100">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
