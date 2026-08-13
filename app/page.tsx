"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  LineChart,
  AlertTriangle,
  Loader2,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ShieldCheck,
  Sparkles
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
  { name: "NIFTY 50", value: 24590.4, change: 96.2, changePct: 0.39 },
  { name: "SENSEX", value: 80334.1, change: 280.6, changePct: 0.35 },
  { name: "BANK NIFTY", value: 50430.5, change: -90.4, changePct: -0.18 },
  { name: "NIFTY IT", value: 39280.2, change: 145.8, changePct: 0.37 },
  { name: "NIFTY PHARMA", value: 21980.7, change: 58.5, changePct: 0.27 },
];

const QUICK_TICKS = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "SBIN"];

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/markets", label: "Markets" },
  { href: "/compare", label: "Compare" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/mutual-funds", label: "Investments" },
  { href: "/ai-research", label: "AI Research" },
];

function formatMoney(value?: number) {
  if (value == null || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}

function formatDelta(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

export default function Home() {
  const [symbol, setSymbol] = useState("RELIANCE.NS");
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
    <main className="min-h-screen app-shell">
      <TickerTape />

      <header className="topbar">
        <div className="max-w-[1420px] mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="brand-mark">
              <LineChart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="brand-title">MarketAI Pro</h1>
              <p className="brand-subtitle">AI-powered financial intelligence for the Indian market.</p>
            </div>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={item.href === "/" ? "active" : ""}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="top-search-wrap">
              <SearchBar onSelect={setSymbol} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1420px] mx-auto px-4 md:px-6 py-6 lg:py-8">
        <section className="hero-panel">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="eyebrow-row">
                <span className="status-dot" />
                Good morning 👋
              </div>
              <h2 className="hero-title">Understand the market before it moves.</h2>
              <p className="hero-subtitle">
                Analyze stocks, discover opportunities, track your portfolio and use AI to understand the Indian market.
              </p>
            </div>

            <div className="hero-stats">
              <div className="hero-mini-card">
                <span className="label">AI Market Score</span>
                <strong>72 / 100</strong>
                <span className="pill positive">Bullish</span>
              </div>
              <div className="hero-mini-card">
                <span className="label">Portfolio Risk</span>
                <strong>Moderate</strong>
                <span className="pill neutral">Balanced</span>
              </div>
            </div>
          </div>

          <div className="quick-search-row">
            {QUICK_TICKS.map((item) => (
              <button key={item} type="button" onClick={() => setSymbol(`${item}.NS`)} className="quick-search-pill">
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="market-grid">
          {MARKET_INDEXES.map((index) => (
            <div key={index.name} className="market-card">
              <div className="market-card-top">
                <div>
                  <p className="market-name">{index.name}</p>
                  <p className="market-value">{formatMoney(index.value)}</p>
                </div>
                <div className={`market-trend ${index.change >= 0 ? "positive" : "negative"}`}>
                  {index.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{formatDelta(index.change)} ({index.changePct.toFixed(2)}%)</span>
                </div>
              </div>
              <div className="sparkline-bar">
                <span style={{ width: `${Math.min(100, Math.abs(index.changePct) * 110)}%` }} />
              </div>
            </div>
          ))}
        </section>

        <section className="dashboard-split">
          <div className="section-card movers-card">
            <div className="section-header">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3>Market Movers</h3>
              </div>
              <div className="segmented">
                <button type="button" className="active">Top Gainers</button>
                <button type="button">Top Losers</button>
              </div>
            </div>

            <div className="movers-list">
              {[
                ["RELIANCE.NS", "Reliance", 1450.6, 2.65, 1000000],
                ["TCS.NS", "TCS", 3940.2, 1.82, 980000],
                ["INFY.NS", "Infosys", 1560.8, 1.44, 870000],
                ["HDFCBANK.NS", "HDFC Bank", 1770.1, 0.92, 760000],
              ].map(([ticker, name, price, change, volume]) => (
                <div key={ticker} className="mover-row">
                  <div>
                    <p className="mover-symbol">{ticker}</p>
                    <p className="mover-name">{name}</p>
                  </div>
                  <div className="mover-price">₹{Number(price).toFixed(2)}</div>
                  <div className={`mover-change ${Number(change) >= 0 ? "positive" : "negative"}`}>
                    {Number(change) >= 0 ? "+" : ""}
                    {Number(change).toFixed(2)}%
                  </div>
                  <div className="mover-volume">{(Number(volume) / 1000000).toFixed(1)}M</div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card pulse-card">
            <div className="section-header">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3>AI Market Pulse</h3>
              </div>
              <span className="pulse-badge">BULLISH</span>
            </div>

            <div className="score-box">
              <div>
                <span className="score-label">AI Market Score</span>
                <p className="score-value">72 / 100</p>
              </div>
              <div className="score-ring">
                <span>72%</span>
              </div>
            </div>

            <div className="sector-list">
              {[
                ["IT", "Strong"],
                ["Banking", "Positive"],
                ["Energy", "Neutral"],
                ["Pharma", "Positive"],
                ["Auto", "Weak"],
              ].map(([sector, signal]) => (
                <div key={sector} className="sector-row">
                  <span>{sector}</span>
                  <span className={`sector-pill ${signal.toLowerCase()}`}>{signal}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-[1400px] mx-auto pt-6 grid grid-cols-1 xl:grid-cols-[1.5fr_360px] gap-6">
          <div className="space-y-6 min-w-0">
            {loading && (
              <div className="section-card p-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <p className="text-muted text-sm">Fetching live data for {symbol}...</p>
              </div>
            )}

            {!loading && error && (
              <div className="section-card p-10 flex flex-col items-center justify-center gap-3 text-center">
                <AlertTriangle className="w-8 h-8 text-negative" />
                <p className="text-gray-200 font-medium">{error}</p>
                <p className="text-xs text-muted">
                  Try formats like AAPL, TSLA, or RELIANCE.NS / TCS.NS for NSE-listed stocks.
                </p>
              </div>
            )}

            {!loading && !error && quote && (
              <>
                <PriceStats quote={quote} onToggleWatch={toggleWatch} isWatched={watchlist.includes(symbol)} />

                <div className="section-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-100">Price Chart</h3>
                    <div className="segmented">
                      {RANGES.map((r) => (
                        <button
                          key={r.range}
                          type="button"
                          onClick={() => setRange(r.range)}
                          className={range === r.range ? "active" : ""}
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

          <div className="space-y-6">
            <Watchlist
              symbols={watchlist}
              onSelect={setSymbol}
              onRemove={(s) => setWatchlist((prev) => prev.filter((x) => x !== s))}
            />
            <ChatPanel quote={quote} />
          </div>
        </div>

        <section className="bottom-grid">
          <div className="section-card brief-card">
            <div className="section-header compact-header">
              <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /><h3>Technical Snapshot</h3></div>
              <span className="pill positive">Bullish</span>
            </div>
            <div className="metric-grid">
              {[
                ["RSI", "62.4"],
                ["MACD", "Bullish"],
                ["50D SMA", "₹1,285.60"],
                ["200D SMA", "₹1,238.10"],
                ["Trend", "Uptrend"],
                ["Support", "₹1,240"],
              ].map(([label, value]) => (
                <div key={label} className="mini-metric">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card brief-card">
            <div className="section-header compact-header">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /><h3>Fundamental Overview</h3></div>
            </div>
            <div className="metric-grid">
              {[
                ["Market Cap", "₹18.7T"],
                ["P/E", "23.8"],
                ["ROE", "15.7%"],
                ["ROCE", "18.4%"],
                ["Debt/Equity", "0.38"],
                ["Dividend Yield", "0.52%"],
              ].map(([label, value]) => (
                <div key={label} className="mini-metric">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="page-footer">
        <div className="max-w-[1420px] mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>Built for the Indian market · Educational use only · Not financial advice.</p>
          <div className="flex items-center gap-3">
            <Link href="/compare">Compare</Link>
            <Link href="/screener">Screener</Link>
            <Link href="/portfolio">Portfolio</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
