"use client";

import { useState } from "react";
import AppPageShell from "@/components/AppPageShell";
import SearchBar from "@/components/SearchBar";
import { Plus, X, ArrowLeftRight, Check, TrendingUp, TrendingDown } from "lucide-react";

interface CompareStock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  marketCap: string;
  pe: number;
  roe: number;
  sector: string;
  fiftyTwoHigh: string;
  fiftyTwoLow: string;
  positive: boolean;
}

const INITIAL_STOCKS: CompareStock[] = [
  {
    symbol: "RELIANCE.NS",
    name: "Reliance Industries",
    price: "₹1,450.60",
    change: "+2.65%",
    marketCap: "₹18.7T",
    pe: 23.8,
    roe: 15.7,
    sector: "Energy & Conglomerate",
    fiftyTwoHigh: "₹1,608.00",
    fiftyTwoLow: "₹1,220.00",
    positive: true,
  },
  {
    symbol: "TCS.NS",
    name: "Tata Consultancy Services",
    price: "₹3,940.20",
    change: "+1.82%",
    marketCap: "₹12.1T",
    pe: 29.5,
    roe: 48.2,
    sector: "IT Services",
    fiftyTwoHigh: "₹4,250.00",
    fiftyTwoLow: "₹3,310.00",
    positive: true,
  },
  {
    symbol: "INFY.NS",
    name: "Infosys",
    price: "₹1,560.80",
    change: "+1.44%",
    marketCap: "₹7.8T",
    pe: 24.1,
    roe: 31.5,
    sector: "IT Services",
    fiftyTwoHigh: "₹1,750.00",
    fiftyTwoLow: "₹1,350.00",
    positive: true,
  },
  {
    symbol: "HDFCBANK.NS",
    name: "HDFC Bank",
    price: "₹1,770.10",
    change: "+0.92%",
    marketCap: "₹11.4T",
    pe: 18.4,
    roe: 16.9,
    sector: "Banking & Financials",
    fiftyTwoHigh: "₹1,880.00",
    fiftyTwoLow: "₹1,360.00",
    positive: true,
  },
];

export default function ComparePage() {
  const [stocks, setStocks] = useState<CompareStock[]>(INITIAL_STOCKS);

  function handleAddSymbol(sym: string) {
    if (stocks.some((s) => s.symbol === sym)) return;
    const newStock: CompareStock = {
      symbol: sym,
      name: sym.replace(".NS", "").replace(".BO", ""),
      price: "₹1,250.00",
      change: "+1.50%",
      marketCap: "₹4.5T",
      pe: 22.0,
      roe: 18.5,
      sector: "NSE Equity",
      fiftyTwoHigh: "₹1,400.00",
      fiftyTwoLow: "₹1,050.00",
      positive: true,
    };
    setStocks([...stocks, newStock]);
  }

  function handleRemove(sym: string) {
    setStocks(stocks.filter((s) => s.symbol !== sym));
  }

  return (
    <AppPageShell
      title="Side-by-Side Stock Comparator"
      subtitle="Evaluate key fundamental indicators, valuation ratios, ROE, and market cap across Indian companies."
    >
      <div className="space-y-6">
        {/* Search & Add Header */}
        <div className="glass-panel glow-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-100 text-sm flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-primary" /> Active Comparisons ({stocks.length} / 4)
            </h3>
            <p className="text-xs text-muted mt-0.5">Search any NSE ticker to add it to the comparison matrix.</p>
          </div>
          <div className="w-full md:w-80">
            <SearchBar onSelect={handleAddSymbol} />
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="glass-panel glow-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-panel2/60 text-xs uppercase text-muted tracking-wider">
                  <th className="p-4 font-bold">Company & Symbol</th>
                  <th className="p-4 font-bold">Current Price</th>
                  <th className="p-4 font-bold">1D Return</th>
                  <th className="p-4 font-bold">Market Cap</th>
                  <th className="p-4 font-bold">P/E Ratio</th>
                  <th className="p-4 font-bold">Return on Equity (ROE)</th>
                  <th className="p-4 font-bold">52W High</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s) => (
                  <tr key={s.symbol} className="border-b border-border/40 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold">
                      <div className="text-gray-100 text-base">{s.name}</div>
                      <div className="text-xs text-muted font-mono-num">{s.symbol} · {s.sector}</div>
                    </td>
                    <td className="p-4 font-mono-num font-bold text-gray-100">{s.price}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono-num ${
                        s.positive ? "bg-positive/10 text-up border border-positive/20" : "bg-negative/10 text-down border border-negative/20"
                      }`}>
                        {s.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {s.change}
                      </span>
                    </td>
                    <td className="p-4 font-mono-num font-bold text-gray-200">{s.marketCap}</td>
                    <td className="p-4 font-mono-num font-bold text-gray-200">{s.pe}x</td>
                    <td className="p-4 font-mono-num font-bold text-up">{s.roe}%</td>
                    <td className="p-4 font-mono-num text-xs text-muted">{s.fiftyTwoHigh}</td>
                    <td className="p-4 text-right">
                      {stocks.length > 1 && (
                        <button
                          onClick={() => handleRemove(s.symbol)}
                          className="p-1.5 rounded-lg border border-border text-muted hover:text-down hover:bg-negative/10 transition-colors"
                          title="Remove stock"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Fundamental Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel glow-border p-5">
            <h3 className="font-bold text-gray-100 text-sm mb-4">Return on Equity (ROE) Leaderboard</h3>
            <div className="space-y-3">
              {[...stocks].sort((a, b) => b.roe - a.roe).map((s) => (
                <div key={s.symbol}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{s.name} ({s.symbol})</span>
                    <span className="font-mono-num text-up font-bold">{s.roe}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 border border-border overflow-hidden">
                    <div className="h-2 rounded-full bg-positive" style={{ width: `${Math.min(100, (s.roe / 50) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel glow-border p-5">
            <h3 className="font-bold text-gray-100 text-sm mb-4">Valuation (P/E Ratio Multiples)</h3>
            <div className="space-y-3">
              {[...stocks].sort((a, b) => a.pe - b.pe).map((s) => (
                <div key={s.symbol}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{s.name} ({s.symbol})</span>
                    <span className="font-mono-num text-primary font-bold">{s.pe}x P/E</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 border border-border overflow-hidden">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(100, (s.pe / 40) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
