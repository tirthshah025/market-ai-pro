"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  LineChart,
  AlertTriangle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import AppPageShell from "@/components/AppPageShell";
import PriceStats from "@/components/PriceStats";
import StockChart from "@/components/StockChart";
import InsightsCard from "@/components/InsightsCard";
import ChatPanel from "@/components/ChatPanel";
import Watchlist from "@/components/Watchlist";
import { QuoteData } from "@/lib/types";

const WATCHLIST_KEY = "marketai_watchlist_v1";

const RANGES = [
  { label: "1M", range: "1mo" },
  { label: "3M", range: "3mo" },
  { label: "6M", range: "6mo" },
  { label: "1Y", range: "1y" },
  { label: "2Y", range: "2y" },
  { label: "5Y", range: "5y" },
];

export default function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = use(params);
  const rawSymbol = decodeURIComponent(resolvedParams.symbol);

  const [range, setRange] = useState("6mo");
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchlistLoaded, setWatchlistLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_KEY);
      setWatchlist(saved ? JSON.parse(saved) : ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]);
    } catch {
      setWatchlist(["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]);
    } finally {
      setWatchlistLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (watchlistLoaded) localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist, watchlistLoaded]);

  const loadQuote = useCallback(async (sym: string, rng: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quote?symbol=${encodeURIComponent(sym)}&range=${rng}&interval=1d`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || `Could not find stock data for '${sym}'.`);
        setQuote(null);
      } else {
        setQuote(data);
      }
    } catch {
      setError("Network error while fetching stock data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuote(rawSymbol, range);
  }, [rawSymbol, range, loadQuote]);

  function toggleWatch() {
    setWatchlist((prev) => (prev.includes(rawSymbol) ? prev.filter((s) => s !== rawSymbol) : [...prev, rawSymbol]));
  }

  const isWatched = watchlist.includes(rawSymbol);

  return (
    <AppPageShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-xs text-muted font-mono-num font-semibold">Ticker: {rawSymbol}</span>
        </div>

        {loading ? (
          <div className="glass-panel glow-border p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-semibold text-muted">Fetching real-time market data for {rawSymbol}...</p>
          </div>
        ) : error ? (
          <div className="glass-panel glow-border p-8 border-negative/30 bg-negative/5 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-down shrink-0" />
            <div>
              <h3 className="font-bold text-foreground">Unable to load stock quote</h3>
              <p className="text-xs text-muted mt-0.5">{error}</p>
            </div>
          </div>
        ) : quote ? (
          <div className="space-y-6">
            <PriceStats quote={quote} onToggleWatch={toggleWatch} isWatched={isWatched} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Candlestick Chart */}
              <div className="xl:col-span-2 glass-panel glow-border p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-foreground text-base">Technical Price Chart</h3>
                    <p className="text-xs text-muted">OHLC Candlesticks + Volume + 20/50 SMA</p>
                  </div>
                  <div className="segmented">
                    {RANGES.map((r) => (
                      <button
                        key={r.range}
                        onClick={() => setRange(r.range)}
                        className={range === r.range ? "active font-bold" : ""}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <StockChart data={quote.candles} />
              </div>

              {/* AI Insights Card */}
              <div className="xl:col-span-1">
                <InsightsCard quote={quote} />
              </div>
            </div>

            {/* AI Chat Assistant & Watchlist */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChatPanel quote={quote} />
              </div>
              <div className="lg:col-span-1">
                <Watchlist
                  symbols={watchlist}
                  onSelect={(s) => window.location.href = `/stock/${encodeURIComponent(s)}`}
                  onRemove={(s) => setWatchlist(watchlist.filter((x) => x !== s))}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppPageShell>
  );
}
