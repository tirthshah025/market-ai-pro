"use client";

import { useEffect, useState, useCallback } from "react";
import { LineChart, AlertTriangle, Loader2, CandlestickChart as StocksIcon, Rocket, PiggyBank } from "lucide-react";
import TickerTape from "@/components/TickerTape";
import SearchBar from "@/components/SearchBar";
import PriceStats from "@/components/PriceStats";
import StockChart from "@/components/StockChart";
import InsightsCard from "@/components/InsightsCard";
import ChatPanel from "@/components/ChatPanel";
import Watchlist from "@/components/Watchlist";
import IPOList from "@/components/IPOList";
import MutualFunds from "@/components/MutualFunds";
import { QuoteData } from "@/lib/types";

const WATCHLIST_KEY = "marketai_watchlist_v1";
type Section = "stocks" | "ipo" | "mf";

const RANGES = [
  { label: "1M", range: "1mo" },
  { label: "3M", range: "3mo" },
  { label: "6M", range: "6mo" },
  { label: "1Y", range: "1y" },
  { label: "2Y", range: "2y" },
  { label: "5Y", range: "5y" },
];

export default function Home() {
  const [section, setSection] = useState<Section>("stocks");
  const [symbol, setSymbol] = useState("RELIANCE.NS");
  const [range, setRange] = useState("6mo");
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchlistLoaded, setWatchlistLoaded] = useState(false);

  // Load persisted watchlist on mount
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

  // Persist watchlist on every change (after initial load)
  useEffect(() => {
    if (watchlistLoaded) localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist, watchlistLoaded]);

  const loadQuote = useCallback(async (sym: string, rng: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quote?symbol=${encodeURIComponent(sym)}&range=${rng}&interval=1d`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Could not find data for '${sym}'.`);
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
    loadQuote(symbol, range);
  }, [symbol, range, loadQuote]);

  function toggleWatch() {
    setWatchlist((prev) => (prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]));
  }

  return (
    <main className="min-h-screen">
      <TickerTape />

      {/* Top nav */}
      <div className="border-b border-border bg-panel/40 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center shadow-glow">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-gray-100 leading-none">MarketAI Pro</h1>
              <p className="text-[11px] text-muted">Indian Market · AI-Powered Analytics</p>
            </div>
          </div>

          <div className="flex gap-1 bg-panel2 rounded-lg p-1">
            {[
              { id: "stocks" as Section, label: "Stocks", icon: StocksIcon },
              { id: "ipo" as Section, label: "IPOs", icon: Rocket },
              { id: "mf" as Section, label: "Mutual Funds", icon: PiggyBank },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSection(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  section === tab.id ? "bg-accent text-white" : "text-muted hover:text-gray-200"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {section === "stocks" && <SearchBar onSelect={setSymbol} />}
        </div>
      </div>

      {section === "ipo" && (
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <IPOList />
        </div>
      )}

      {section === "mf" && (
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <MutualFunds />
        </div>
      )}

      {section === "stocks" && (
      <div className="max-w-[1400px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* LEFT: charts + stats */}
        <div className="space-y-6 min-w-0">
          {loading && (
            <div className="glass-panel glow-border p-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
              <p className="text-sm text-muted">Fetching live data for {symbol}...</p>
            </div>
          )}

          {!loading && error && (
            <div className="glass-panel glow-border p-10 flex flex-col items-center justify-center gap-3 text-center">
              <AlertTriangle className="w-8 h-8 text-down" />
              <p className="text-gray-200 font-medium">{error}</p>
              <p className="text-xs text-muted">
                Try formats like AAPL, TSLA, or RELIANCE.NS / TCS.NS for NSE-listed stocks.
              </p>
            </div>
          )}

          {!loading && !error && quote && (
            <>
              <PriceStats quote={quote} onToggleWatch={toggleWatch} isWatched={watchlist.includes(symbol)} />

              <div className="glass-panel glow-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-100 text-sm">Price Chart</h3>
                  <div className="flex gap-1 bg-panel2 rounded-lg p-1">
                    {RANGES.map((r) => (
                      <button
                        key={r.range}
                        onClick={() => setRange(r.range)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                          range === r.range ? "bg-accent text-white" : "text-muted hover:text-gray-200"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <StockChart data={quote.candles} />
              </div>

              <InsightsCard quote={quote} />
            </>
          )}
        </div>

        {/* RIGHT: sidebar */}
        <div className="space-y-6">
          <Watchlist
            symbols={watchlist}
            onSelect={setSymbol}
            onRemove={(s) => setWatchlist((prev) => prev.filter((x) => x !== s))}
          />
          <ChatPanel quote={quote} />
        </div>
      </div>
      )}

      <footer className="max-w-[1400px] mx-auto px-6 py-8 text-center text-xs text-muted">
        Built by Tirth Shah · Market data via Yahoo Finance · AI powered by Claude · Educational use only, not financial advice.
      </footer>
    </main>
  );
}
