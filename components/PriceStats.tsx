"use client";

import { TrendingUp, TrendingDown, Star, Building2, BarChart2 } from "lucide-react";
import { QuoteData } from "@/lib/types";

function fmtLarge(n?: number) {
  if (n == null || isNaN(n)) return "N/A";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
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
  const low52 = quote.fiftyTwoWeekLow ?? quote.regularMarketDayLow ?? 0;
  const high52 = quote.fiftyTwoWeekHigh ?? quote.regularMarketDayHigh ?? 1;
  const rangePct = high52 > low52 ? Math.max(0, Math.min(100, ((quote.regularMarketPrice - low52) / (high52 - low52)) * 100)) : 50;

  return (
    <div className="glass-panel glow-border p-5 sm:p-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-100 tracking-tight">
              {quote.shortName || quote.symbol}
            </h2>
            <span className="text-xs text-muted bg-white/5 border border-border px-2.5 py-1 rounded-md font-mono-num font-semibold">
              {quote.symbol}
            </span>
            <button
              onClick={onToggleWatch}
              className="p-1.5 rounded-lg border border-border bg-white/5 hover:bg-white/10 transition-colors"
              title={isWatched ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Star className={`w-4 h-4 transition-colors ${isWatched ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
            </button>
          </div>
          <p className="text-xs text-muted mt-1.5 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {quote.exchange || "NSE/BSE"}</span>
            {quote.sector && <span>· {quote.sector}</span>}
            {quote.industry && <span>· {quote.industry}</span>}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-3xl sm:text-4xl font-extrabold font-mono-num text-gray-100 tracking-tight">
            {quote.currency === "INR" || quote.symbol.endsWith(".NS") || quote.symbol.endsWith(".BO") ? "₹" : "$"}
            {quote.regularMarketPrice?.toFixed(2)}
          </div>
          <div className={`flex items-center sm:justify-end gap-1.5 text-sm font-bold font-mono-num mt-1 ${isUp ? "text-up" : "text-down"}`}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isUp ? "+" : ""}{quote.regularMarketChange?.toFixed(2)}</span>
            <span>({isUp ? "+" : ""}{quote.regularMarketChangePercent?.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* 52-Week Range Visualizer */}
      {quote.fiftyTwoWeekHigh != null && quote.fiftyTwoWeekLow != null && (
        <div className="mb-5 p-3 rounded-xl bg-panel2/60 border border-border/60">
          <div className="flex justify-between text-xs text-muted mb-1.5 font-mono-num">
            <span>52W Low: ₹{quote.fiftyTwoWeekLow.toFixed(2)}</span>
            <span className="font-semibold text-gray-300">52-Week Range ({rangePct.toFixed(0)}%)</span>
            <span>52W High: ₹{quote.fiftyTwoWeekHigh.toFixed(2)}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 border border-border relative overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent2 transition-all duration-500"
              style={{ width: `${rangePct}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          ["Open", `₹${quote.regularMarketOpen?.toFixed(2) ?? "N/A"}`],
          ["Day High", `₹${quote.regularMarketDayHigh?.toFixed(2) ?? "N/A"}`],
          ["Day Low", `₹${quote.regularMarketDayLow?.toFixed(2) ?? "N/A"}`],
          ["Prev Close", `₹${quote.regularMarketPreviousClose?.toFixed(2) ?? "N/A"}`],
          ["Market Cap", fmtLarge(quote.marketCap)],
          ["Volume", fmtLarge(quote.regularMarketVolume)],
        ].map(([label, value]) => (
          <div key={label} className="bg-panel2 border border-border/80 rounded-xl p-3 hover:border-primary/30 transition-colors">
            <p className="text-[10px] uppercase tracking-wider text-muted mb-1 font-semibold">{label}</p>
            <p className="text-sm font-bold font-mono-num text-gray-100">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
