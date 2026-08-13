"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Search,
  TrendingUp,
  TrendingDown,
  Sparkles,
  BarChart3,
  Star,
  Activity,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import AppPageShell from "@/components/AppPageShell";
import SearchBar from "@/components/SearchBar";

interface MarketIndex {
  name: string;
  value: string;
  change: string;
  changePct: string;
  positive: boolean;
}

interface Mover {
  symbol: string;
  company: string;
  price: string;
  change: string;
  changePct: string;
  volume: string;
  positive: boolean;
}

const MARKET_INDEXES: MarketIndex[] = [
  { name: "NIFTY 50", value: "24,590.40", change: "+96.20", changePct: "+0.39%", positive: true },
  { name: "SENSEX", value: "80,334.10", change: "+280.60", changePct: "+0.35%", positive: true },
  { name: "BANK NIFTY", value: "50,430.50", change: "-90.40", changePct: "-0.18%", positive: false },
  { name: "NIFTY IT", value: "39,280.20", change: "+145.80", changePct: "+0.37%", positive: true },
  { name: "NIFTY PHARMA", value: "21,980.70", change: "+58.50", changePct: "+0.27%", positive: true },
];

const TOP_GAINERS: Mover[] = [
  { symbol: "TATAMOTORS.NS", company: "Tata Motors Ltd", price: "₹1,045.20", change: "+41.30", changePct: "+4.12%", volume: "14.2M", positive: true },
  { symbol: "SBIN.NS", company: "State Bank of India", price: "₹842.60", change: "+26.80", changePct: "+3.28%", volume: "18.5M", positive: true },
  { symbol: "RELIANCE.NS", company: "Reliance Industries", price: "₹1,450.60", change: "+37.40", changePct: "+2.65%", volume: "9.8M", positive: true },
  { symbol: "ICICIBANK.NS", company: "ICICI Bank Ltd", price: "₹1,215.40", change: "+25.00", changePct: "+2.10%", volume: "11.4M", positive: true },
];

const TOP_LOSERS: Mover[] = [
  { symbol: "HDFCBANK.NS", company: "HDFC Bank Ltd", price: "₹1,610.80", change: "-30.40", changePct: "-1.85%", volume: "16.1M", positive: false },
  { symbol: "AXISBANK.NS", company: "Axis Bank Ltd", price: "₹1,140.20", change: "-16.40", changePct: "-1.42%", volume: "8.2M", positive: false },
  { symbol: "KOTAKBANK.NS", company: "Kotak Mahindra Bank", price: "₹1,780.50", change: "-20.70", changePct: "-1.15%", volume: "5.4M", positive: false },
  { symbol: "WIPRO.NS", company: "Wipro Ltd", price: "₹495.30", change: "-4.50", changePct: "-0.90%", volume: "7.8M", positive: false },
];

const MOST_ACTIVE: Mover[] = [
  { symbol: "RELIANCE.NS", company: "Reliance Industries", price: "₹1,450.60", change: "+37.40", changePct: "+2.65%", volume: "22.4M", positive: true },
  { symbol: "HDFCBANK.NS", company: "HDFC Bank Ltd", price: "₹1,610.80", change: "-30.40", changePct: "-1.85%", volume: "18.9M", positive: false },
  { symbol: "SBIN.NS", company: "State Bank of India", price: "₹842.60", change: "+26.80", changePct: "+3.28%", volume: "18.5M", positive: true },
  { symbol: "INFY.NS", company: "Infosys Ltd", price: "₹1,560.80", change: "+22.15", changePct: "+1.44%", volume: "12.6M", positive: true },
];

const VOLUME_LEADERS: Mover[] = [
  { symbol: "IDEA.NS", company: "Vodafone Idea Ltd", price: "₹14.20", change: "+0.80", changePct: "+5.97%", volume: "185.0M", positive: true },
  { symbol: "YESBANK.NS", company: "Yes Bank Ltd", price: "₹24.50", change: "+0.40", changePct: "+1.66%", volume: "94.2M", positive: true },
  { symbol: "SUZLON.NS", company: "Suzlon Energy Ltd", price: "₹68.40", change: "+2.30", changePct: "+3.48%", volume: "62.1M", positive: true },
  { symbol: "IRFC.NS", company: "Indian Railway Finance", price: "₹178.20", change: "+4.10", changePct: "+2.35%", volume: "45.8M", positive: true },
];

const SECTOR_SIGNALS = [
  { sector: "IT Services", signal: "Bullish Momentum", score: 82, trend: "+1.82%" },
  { sector: "Banking & Financials", signal: "Neutral Consolidation", score: 68, trend: "+0.45%" },
  { sector: "Energy & Conglomerate", signal: "Constructive Expansion", score: 76, trend: "+1.10%" },
  { sector: "Pharmaceuticals", signal: "Strong Buy Signal", score: 88, trend: "+1.25%" },
  { sector: "Automobiles", signal: "Moderate Pullback", score: 48, trend: "-0.85%" },
  { sector: "FMCG", signal: "Stable Accumulation", score: 64, trend: "+0.20%" },
];

const TRENDING_EQUITIES = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries", price: "₹1,450.60", change: "+2.65%", sector: "Energy" },
  { symbol: "TCS.NS", name: "TCS", price: "₹3,940.20", change: "+1.82%", sector: "IT Services" },
  { symbol: "INFY.NS", name: "Infosys", price: "₹1,560.80", change: "+1.44%", sector: "IT Services" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", price: "₹1,770.10", change: "+0.92%", sector: "Banking" },
  { symbol: "SBIN.NS", name: "State Bank of India", price: "₹842.60", change: "+3.28%", sector: "Banking" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", price: "₹1,045.20", change: "+4.12%", sector: "Auto" },
];

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning 👋";
  if (hour < 17) return "Good afternoon 👋";
  return "Good evening 👋";
}

export default function Home() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Good morning 👋");
  const [moverTab, setMoverTab] = useState<"gainers" | "losers" | "active" | "volume">("gainers");
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    setGreeting(getTimeGreeting());
    try {
      const saved = localStorage.getItem("marketai_watchlist_v1");
      if (saved) setWatchlist(JSON.parse(saved));
      else setWatchlist(["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]);
    } catch {
      setWatchlist(["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]);
    }
  }, []);

  const activeMovers =
    moverTab === "gainers"
      ? TOP_GAINERS
      : moverTab === "losers"
      ? TOP_LOSERS
      : moverTab === "active"
      ? MOST_ACTIVE
      : VOLUME_LEADERS;

  return (
    <AppPageShell>
      <div className="space-y-8">
        {/* Stage 2 Hero Section */}
        <section className="glass-panel glow-border p-6 sm:p-10 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft border border-primary/20 text-xs font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> {greeting} Welcome to MarketAI Pro
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Understand the market before it moves.
            </h1>
            <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto">
              Analyze stocks, discover opportunities, track your portfolio and use AI to understand the Indian market in real-time.
            </p>

            {/* Large Search Input */}
            <div className="pt-3 max-w-xl mx-auto">
              <SearchBar placeholder="Search stocks, mutual funds, IPOs e.g. RELIANCE, TCS..." />
            </div>
          </div>
        </section>

        {/* Market Overview Index Cards */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Indian Market Overview
            </h3>
            <span className="text-xs text-muted font-mono-num">Real-Time NSE/BSE Feeds</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {MARKET_INDEXES.map((idx) => (
              <div key={idx.name} className="glass-panel glow-border p-4 hover:scale-[1.01] transition-transform">
                <p className="text-[11px] uppercase tracking-wider text-muted font-bold">{idx.name}</p>
                <p className="text-xl sm:text-2xl font-extrabold font-mono-num text-foreground mt-1">{idx.value}</p>
                <div
                  className={`mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono-num ${
                    idx.positive ? "bg-positive/10 text-up border border-positive/20" : "bg-negative/10 text-down border border-negative/20"
                  }`}
                >
                  {idx.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {idx.change} ({idx.changePct})
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Middle Split: Market Movers + AI Market Pulse */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Market Movers Section */}
          <div className="xl:col-span-2 glass-panel glow-border p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground text-base">Market Movers</h3>
              </div>
              <div className="segmented">
                <button onClick={() => setMoverTab("gainers")} className={moverTab === "gainers" ? "active" : ""}>
                  Gainers
                </button>
                <button onClick={() => setMoverTab("losers")} className={moverTab === "losers" ? "active" : ""}>
                  Losers
                </button>
                <button onClick={() => setMoverTab("active")} className={moverTab === "active" ? "active" : ""}>
                  Most Active
                </button>
                <button onClick={() => setMoverTab("volume")} className={moverTab === "volume" ? "active" : ""}>
                  Volume Leaders
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase text-muted border-b border-border bg-card-strong tracking-wider">
                    <th className="p-3 font-bold">Symbol & Company</th>
                    <th className="p-3 font-bold">Price</th>
                    <th className="p-3 font-bold">Change (%)</th>
                    <th className="p-3 font-bold text-right">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMovers.map((m) => (
                    <tr
                      key={m.symbol}
                      onClick={() => router.push(`/stock/${encodeURIComponent(m.symbol)}`)}
                      className="border-b border-border/40 hover:bg-primary-soft/30 cursor-pointer transition-colors"
                    >
                      <td className="p-3 font-semibold">
                        <div className="text-foreground font-bold text-sm">{m.company}</div>
                        <div className="text-xs text-muted font-mono-num">{m.symbol}</div>
                      </td>
                      <td className="p-3 font-mono-num font-bold text-foreground">{m.price}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 font-mono-num font-bold text-xs ${m.positive ? "text-up" : "text-down"}`}>
                          {m.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {m.changePct}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono-num text-muted font-semibold">{m.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Market Pulse Section */}
          <div className="xl:col-span-1 glass-panel glow-border p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground text-base">AI Market Pulse</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-positive/10 text-up border border-positive/20 font-bold font-mono-num">
                Bullish (74/100)
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Algorithmic intelligence evaluating technical trend continuity, market breadth, and sector momentum across Indian equities.
            </p>

            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-muted tracking-wider">Sector Technical Signals</h4>
              {SECTOR_SIGNALS.map((s) => (
                <div key={s.sector} className="p-3 rounded-xl bg-card-strong border border-border/80 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-foreground">{s.sector}</span>
                    <span className="font-mono-num text-primary">{s.trend}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted">
                    <span>{s.signal}</span>
                    <span className="font-mono-num font-semibold">{s.score}% score</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-positive" style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Split: Watchlist Preview & Trending Discovery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Watchlist Compact Preview */}
          <div className="lg:col-span-1 glass-panel glow-border p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h3 className="font-bold text-foreground text-sm">Watchlist Preview</h3>
              </div>
              <Link href="/portfolio" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {watchlist.map((sym) => (
                <div
                  key={sym}
                  onClick={() => router.push(`/stock/${encodeURIComponent(sym)}`)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 hover:bg-primary-soft/30 cursor-pointer transition-all"
                >
                  <span className="text-xs font-bold text-foreground font-mono-num">{sym}</span>
                  <span className="text-xs font-mono-num text-up font-bold">+1.85%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent & Trending Equities Discovery */}
          <div className="lg:col-span-2 glass-panel glow-border p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-foreground text-sm">Trending Indian Equities</h3>
              </div>
              <Link href="/screener" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                Stock Screener <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {TRENDING_EQUITIES.map((eq) => (
                <button
                  key={eq.symbol}
                  onClick={() => router.push(`/stock/${encodeURIComponent(eq.symbol)}`)}
                  className="p-3 rounded-xl bg-card-strong border border-border/70 hover:border-primary/40 text-left transition-all hover:scale-[1.02]"
                >
                  <div className="text-xs font-bold text-foreground">{eq.name}</div>
                  <div className="text-[10px] text-muted font-mono-num mt-0.5">{eq.symbol} · {eq.sector}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-bold font-mono-num text-foreground">{eq.price}</span>
                    <span className="text-xs font-bold font-mono-num text-up">{eq.change}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
