"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LineChart,
  AlertTriangle,
  Loader2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ShieldCheck,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import TickerTape from "@/components/TickerTape";
import SearchBar from "@/components/SearchBar";
import PriceStats from "@/components/PriceStats";
import StockChart from "@/components/StockChart";
import InsightsCard from "@/components/InsightsCard";
import ChatPanel from "@/components/ChatPanel";
import Watchlist from "@/components/Watchlist";
import ThemeToggle from "@/components/ThemeToggle";
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

const MARKET_INDEXES = [
  { name: "NIFTY 50", value: "24,590.40", change: "+96.20", changePct: "+0.39%", positive: true },
  { name: "SENSEX", value: "80,334.10", change: "+280.60", changePct: "+0.35%", positive: true },
  { name: "BANK NIFTY", value: "50,430.50", change: "-90.40", changePct: "-0.18%", positive: false },
  { name: "NIFTY IT", value: "39,280.20", change: "+145.80", changePct: "+0.37%", positive: true },
  { name: "NIFTY PHARMA", value: "21,980.70", change: "+58.50", changePct: "+0.27%", positive: true },
];

const TOP_GAINERS = [
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", price: "₹1,045.20", change: "+4.12%" },
  { symbol: "SBIN.NS", name: "State Bank of India", price: "₹842.60", change: "+3.28%" },
  { symbol: "RELIANCE.NS", name: "Reliance Industries", price: "₹1,450.60", change: "+2.65%" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank", price: "₹1,215.40", change: "+2.10%" },
];

const TOP_LOSERS = [
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", price: "₹1,610.80", change: "-1.85%" },
  { symbol: "AXISBANK.NS", name: "Axis Bank", price: "₹1,140.20", change: "-1.42%" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", price: "₹1,780.50", change: "-1.15%" },
  { symbol: "WIPRO.NS", name: "Wipro", price: "₹495.30", change: "-0.90%" },
];

const QUICK_TICKS = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "SBIN.NS", "TATAMOTORS.NS"];

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/markets", label: "Markets" },
  { href: "/compare", label: "Compare" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/mutual-funds", label: "Investments" },
  { href: "/ai-research", label: "AI Research" },
  { href: "/screener", label: "Screener" },
  { href: "/ipo-intelligence", label: "IPOs" },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const initialSymbol = searchParams.get("symbol") || "RELIANCE.NS";

  const [symbol, setSymbol] = useState(initialSymbol);
  const [range, setRange] = useState("6mo");
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchlistLoaded, setWatchlistLoaded] = useState(false);
  const [moverTab, setMoverTab] = useState<"gainers" | "losers">("gainers");

  useEffect(() => {
    const qSym = searchParams.get("symbol");
    if (qSym) setSymbol(qSym);
  }, [searchParams]);

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
    loadQuote(symbol, range);
  }, [symbol, range, loadQuote]);

  function toggleWatch() {
    setWatchlist((prev) => (prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]));
  }

  const isWatched = watchlist.includes(symbol);

  return (
    <main className="min-h-screen app-shell">
      <TickerTape />

      <header className="topbar">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="brand-mark">
              <LineChart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="brand-title flex items-center gap-1.5">
                MarketAI Pro <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">PRO</span>
              </h1>
              <p className="brand-subtitle">AI-powered financial intelligence for the Indian market.</p>
            </div>
          </Link>

          <nav className="main-nav hidden md:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={item.href === "/" ? "active" : ""}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <div className="top-search-wrap">
              <SearchBar onSelect={setSymbol} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 lg:py-8 space-y-6">
        {/* Quick Tickers & Hero Header */}
        <section className="hero-panel">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="eyebrow-row">
                <span className="status-dot" /> Live Market Feed · NSE / BSE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-100 mt-2 tracking-tight">
                Indian Financial Markets & AI Analytics
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted font-semibold mr-1">Popular Tickers:</span>
              {QUICK_TICKS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSymbol(s)}
                  className={`text-xs px-3 py-1.5 rounded-full font-mono-num font-semibold transition-all ${
                    symbol === s
                      ? "bg-primary text-white shadow-glow"
                      : "bg-white/5 border border-border text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {s.replace(".NS", "")}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Live Market Indices Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {MARKET_INDEXES.map((idx) => (
            <div key={idx.name} className="glass-panel glow-border p-4 hover:scale-[1.01] transition-transform">
              <p className="text-[11px] uppercase tracking-wider text-muted font-bold">{idx.name}</p>
              <p className="text-xl font-bold font-mono-num text-gray-100 mt-1">{idx.value}</p>
              <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold font-mono-num ${
                idx.positive ? "bg-positive/10 text-up border border-positive/20" : "bg-negative/10 text-down border border-negative/20"
              }`}>
                {idx.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {idx.change} ({idx.changePct})
              </div>
            </div>
          ))}
        </div>

        {/* Stock Detail & Chart Section */}
        {loading ? (
          <div className="glass-panel glow-border p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-semibold text-muted">Fetching real-time market data for {symbol}...</p>
          </div>
        ) : error ? (
          <div className="glass-panel glow-border p-8 border-negative/30 bg-negative/5 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-down shrink-0" />
            <div>
              <h3 className="font-bold text-gray-100">Unable to load stock quote</h3>
              <p className="text-xs text-muted mt-0.5">{error}</p>
            </div>
          </div>
        ) : quote ? (
          <div className="space-y-6">
            <PriceStats quote={quote} onToggleWatch={toggleWatch} isWatched={isWatched} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Candlestick Chart with Range Selector */}
              <div className="xl:col-span-2 glass-panel glow-border p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-100 text-base">Technical Price Chart</h3>
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
          </div>
        ) : null}

        {/* Bottom Split: AI Chat Assistant + Watchlist & Top Movers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChatPanel quote={quote} />
          </div>

          <div className="space-y-6 lg:col-span-1">
            <Watchlist symbols={watchlist} onSelect={setSymbol} onRemove={(s) => setWatchlist(watchlist.filter((x) => x !== s))} />

            {/* Top Market Movers Card */}
            <div className="glass-panel glow-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-gray-100 text-sm">Market Movers</h3>
                </div>
                <div className="segmented">
                  <button onClick={() => setMoverTab("gainers")} className={moverTab === "gainers" ? "active" : ""}>
                    Gainers
                  </button>
                  <button onClick={() => setMoverTab("losers")} className={moverTab === "losers" ? "active" : ""}>
                    Losers
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {(moverTab === "gainers" ? TOP_GAINERS : TOP_LOSERS).map((m) => (
                  <button
                    key={m.symbol}
                    onClick={() => setSymbol(m.symbol)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-white/5 transition-all text-left"
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-100 font-mono-num">{m.name}</div>
                      <div className="text-[10px] text-muted">{m.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono-num text-gray-200">{m.price}</div>
                      <div className={`text-[11px] font-bold font-mono-num ${moverTab === "gainers" ? "text-up" : "text-down"}`}>
                        {m.change}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base p-8 text-center text-muted">Loading dashboard...</div>}>
      <HomeContent />
    </Suspense>
  );
}
