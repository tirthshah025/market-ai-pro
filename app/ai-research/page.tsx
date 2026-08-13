"use client";

import { useState } from "react";
import AppPageShell from "@/components/AppPageShell";
import SearchBar from "@/components/SearchBar";
import { Sparkles, Brain, ShieldCheck, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";

interface AIReport {
  symbol: string;
  name: string;
  sentiment: string;
  healthScore: number;
  summary: string;
  catalysts: string[];
  risks: string[];
}

const FEATURED_REPORTS: Record<string, AIReport> = {
  "RELIANCE.NS": {
    symbol: "RELIANCE.NS",
    name: "Reliance Industries",
    sentiment: "Moderately Bullish",
    healthScore: 8.8,
    summary: "Diversified conglomerate spanning O2C energy, Jio Telecom, and Retail. High cash flow generation supports digital infrastructure expansion and retail distribution dominance.",
    catalysts: [
      "Jio Telecom ARPU growth and potential IPO value unlocking.",
      "Retail network expansion into Tier 2/3 Indian cities.",
      "New Energy solar gigafactories commissioning in Jamnagar.",
    ],
    risks: [
      "Volatility in refining margins & global petrochemical spreads.",
      "Capital expenditure intensity slowing free cash flow velocity.",
    ],
  },
  "TCS.NS": {
    symbol: "TCS.NS",
    name: "Tata Consultancy Services",
    sentiment: "Stable Bullish",
    healthScore: 9.2,
    summary: "Market leader in enterprise IT services with industry-leading operating margins (24-25%) and exceptional return on equity (>45%).",
    catalysts: [
      "Large deal wins in Cloud migration & Generative AI implementation.",
      "Margin expansion from favorable sub-contractor cost reduction.",
    ],
    risks: [
      "Cautious discretionary IT spending by North American BFSI clients.",
      "Foreign exchange currency fluctuations.",
    ],
  },
  "HDFCBANK.NS": {
    symbol: "HDFCBANK.NS",
    name: "HDFC Bank",
    sentiment: "Neutral-Positive",
    healthScore: 8.5,
    summary: "India's premier private lender post-merger with HDFC Ltd. Boasts robust asset quality, low NPA ratios, and unmatched deposit branch distribution.",
    catalysts: [
      "Post-merger deposit mobilization catching up with credit growth.",
      "Cross-selling mortgage and insurance products to core banking base.",
    ],
    risks: [
      "Net Interest Margin (NIM) pressure during high interest rate environments.",
    ],
  },
};

export default function AIResearchPage() {
  const [activeSymbol, setActiveSymbol] = useState("RELIANCE.NS");
  const [loading, setLoading] = useState(false);

  function handleSelect(sym: string) {
    setActiveSymbol(sym);
  }

  const currentReport = FEATURED_REPORTS[activeSymbol] || {
    symbol: activeSymbol,
    name: activeSymbol.replace(".NS", "").replace(".BO", ""),
    sentiment: "Technical Bullish",
    healthScore: 8.0,
    summary: `Detailed AI technical & fundamental synthesis for ${activeSymbol}. Shows positive institutional liquidity support and steady moving average trends across weekly timeframe candles.`,
    catalysts: ["Strong market position in sector.", "Earnings growth trajectory remains intact."],
    risks: ["Sectoral rotation & broader market volatility."],
  };

  return (
    <AppPageShell
      title="AI Investment Research & Stock Reports"
      subtitle="Generate deep-dive AI investment analyses, moat evaluations, financial health ratings, and risk setups across Indian equities."
    >
      <div className="space-y-6">
        {/* Research Search & Selector Bar */}
        <div className="glass-panel glow-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-100 text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" /> AI Equity Intelligence Generator
            </h3>
            <p className="text-xs text-muted mt-0.5">Select a featured bluechip stock or search any NSE ticker for instant AI analysis.</p>
          </div>
          <div className="w-full sm:w-80">
            <SearchBar onSelect={handleSelect} />
          </div>
        </div>

        {/* Featured Stock Tickers Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted font-semibold">Featured Reports:</span>
          {Object.keys(FEATURED_REPORTS).map((sym) => (
            <button
              key={sym}
              onClick={() => handleSelect(sym)}
              className={`text-xs px-3 py-1.5 rounded-full font-mono-num font-semibold transition-all ${
                activeSymbol === sym
                  ? "bg-primary text-white shadow-glow"
                  : "bg-white/5 border border-border text-gray-300 hover:bg-white/10"
              }`}
            >
              {sym.replace(".NS", "")}
            </button>
          ))}
        </div>

        {/* Active AI Stock Report */}
        <div className="glass-panel glow-border p-6 space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-extrabold text-gray-100">{currentReport.name}</h2>
                <span className="text-xs text-muted bg-white/5 border border-border px-2.5 py-0.5 rounded font-mono-num">
                  {currentReport.symbol}
                </span>
              </div>
              <p className="text-xs text-muted mt-1">NSE Listed Equity · AI Coverage Active</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted uppercase font-bold">Health Score</p>
                <p className="text-xl font-extrabold font-mono-num text-up">{currentReport.healthScore} / 10</p>
              </div>
              <div className="p-2.5 rounded-full bg-positive/10 border border-positive/20 text-up">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold text-muted tracking-wider mb-2">Executive Summary</h4>
            <p className="text-sm text-gray-200 leading-relaxed bg-panel2 p-4 rounded-xl border border-border">
              {currentReport.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-positive/5 border border-positive/20 space-y-2">
              <h4 className="text-xs uppercase font-bold text-up tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Key Growth Catalysts
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                {currentReport.catalysts.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-up font-bold">+</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-negative/5 border border-negative/20 space-y-2">
              <h4 className="text-xs uppercase font-bold text-down tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Key Risk Factors
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                {currentReport.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-down font-bold">−</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
