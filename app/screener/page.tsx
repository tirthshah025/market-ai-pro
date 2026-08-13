"use client";

import { useState, useMemo } from "react";
import AppPageShell from "@/components/AppPageShell";
import { Filter, RotateCcw, TrendingUp, TrendingDown, Search } from "lucide-react";

interface ScreenerStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  category: "Large Cap" | "Mid Cap" | "Small Cap";
  roe: number;
  pe: number;
  growth: number;
  sector: string;
}

const STOCK_DATABASE: ScreenerStock[] = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries", price: 1450.6, change: 2.65, category: "Large Cap", roe: 15.7, pe: 23.8, growth: 12.4, sector: "Energy" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", price: 1770.1, change: 0.92, category: "Large Cap", roe: 14.9, pe: 18.4, growth: 16.2, sector: "Banking" },
  { symbol: "INFY.NS", name: "Infosys", price: 1560.8, change: 1.44, category: "Large Cap", roe: 31.5, pe: 24.1, growth: 9.8, sector: "IT" },
  { symbol: "TCS.NS", name: "TCS", price: 3940.2, change: 1.82, category: "Large Cap", roe: 48.2, pe: 29.5, growth: 8.5, sector: "IT" },
  { symbol: "SBIN.NS", name: "State Bank of India", price: 842.6, change: 3.28, category: "Large Cap", roe: 18.4, pe: 11.2, growth: 22.1, sector: "Banking" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", price: 1045.2, change: 4.12, category: "Large Cap", roe: 28.6, pe: 16.5, growth: 26.4, sector: "Auto" },
  { symbol: "SUNPHARMA.NS", name: "Sun Pharma", price: 1720.4, change: 1.10, category: "Large Cap", roe: 16.8, pe: 34.2, growth: 14.0, sector: "Pharma" },
  { symbol: "DIXON.NS", name: "Dixon Technologies", price: 12800.0, change: 5.40, category: "Mid Cap", roe: 25.4, pe: 65.0, growth: 38.5, sector: "Electronics" },
  { symbol: "POLYCAB.NS", name: "Polycab India", price: 6750.0, change: 2.15, category: "Mid Cap", roe: 24.8, pe: 42.0, growth: 21.0, sector: "Electricals" },
  { symbol: "TATAELXSI.NS", name: "Tata Elxsi", price: 7420.0, change: -0.80, category: "Mid Cap", roe: 32.1, pe: 54.0, growth: 11.5, sector: "IT" },
];

export default function ScreenerPage() {
  const [search, setSearch] = useState("");
  const [minRoe, setMinRoe] = useState<number>(0);
  const [maxPe, setMaxPe] = useState<number>(100);
  const [category, setCategory] = useState<string>("All");
  const [sector, setSector] = useState<string>("All");

  const filteredStocks = useMemo(() => {
    return STOCK_DATABASE.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.symbol.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (s.roe < minRoe) return false;
      if (s.pe > maxPe) return false;
      if (category !== "All" && s.category !== category) return false;
      if (sector !== "All" && s.sector !== sector) return false;
      return true;
    });
  }, [search, minRoe, maxPe, category, sector]);

  function handleReset() {
    setSearch("");
    setMinRoe(0);
    setMaxPe(100);
    setCategory("All");
    setSector("All");
  }

  return (
    <AppPageShell
      title="Quantitative Stock Screener"
      subtitle="Filter Indian equities by fundamental valuation, ROE quality thresholds, sector classification, and growth metrics."
    >
      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-6">
        {/* Filter Controls Sidebar */}
        <aside className="glass-panel glow-border p-5 h-fit space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-gray-100 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" /> Screener Filters
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-muted hover:text-primary flex items-center gap-1 transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-muted font-semibold mb-1">Search Company / Symbol</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Reliance, TCS..."
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-muted font-semibold mb-1">Minimum ROE: <strong className="text-gray-100 font-mono-num">{minRoe}%</strong></label>
              <input
                type="range"
                min="0"
                max="40"
                value={minRoe}
                onChange={(e) => setMinRoe(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-muted font-semibold mb-1">Maximum P/E Ratio: <strong className="text-gray-100 font-mono-num">{maxPe}x</strong></label>
              <input
                type="range"
                min="10"
                max="100"
                value={maxPe}
                onChange={(e) => setMaxPe(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-muted font-semibold mb-1">Market Cap Segment</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Large Cap">Large Cap (&gt; ₹50,000 Cr)</option>
                <option value="Mid Cap">Mid Cap (₹15,000 – ₹50,000 Cr)</option>
                <option value="Small Cap">Small Cap (&lt; ₹15,000 Cr)</option>
              </select>
            </div>

            <div>
              <label className="block text-muted font-semibold mb-1">Sector Filter</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value="All">All Sectors</option>
                <option value="IT">IT Services</option>
                <option value="Banking">Banking & Financials</option>
                <option value="Energy">Energy</option>
                <option value="Auto">Automobiles</option>
                <option value="Pharma">Pharmaceuticals</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results Table */}
        <div className="glass-panel glow-border overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center bg-panel2/40">
            <span className="text-xs font-bold text-gray-200">Matching Equities</span>
            <span className="text-xs text-muted font-mono-num">{filteredStocks.length} stocks found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-panel2/60 text-xs uppercase text-muted tracking-wider">
                  <th className="p-4 font-bold">Company</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold">1D Return</th>
                  <th className="p-4 font-bold">Segment</th>
                  <th className="p-4 font-bold">ROE</th>
                  <th className="p-4 font-bold">P/E Ratio</th>
                  <th className="p-4 font-bold">Rev Growth</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((s) => {
                  const isUp = s.change >= 0;
                  return (
                    <tr key={s.symbol} className="border-b border-border/40 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-semibold">
                        <div className="text-gray-100 font-bold text-base">{s.name}</div>
                        <div className="text-xs text-muted font-mono-num">{s.symbol} · {s.sector}</div>
                      </td>
                      <td className="p-4 font-mono-num font-bold text-gray-100">₹{s.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-mono-num font-bold text-xs ${isUp ? "text-up" : "text-down"}`}>
                          {isUp ? "+" : ""}{s.change.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-border font-semibold text-gray-300">
                          {s.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono-num font-bold text-up">{s.roe}%</td>
                      <td className="p-4 font-mono-num font-bold text-gray-200">{s.pe}x</td>
                      <td className="p-4 font-mono-num font-semibold text-primary">+{s.growth}%</td>
                    </tr>
                  );
                })}

                {filteredStocks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted text-sm">
                      No stocks match your filter criteria. Try lowering the min ROE or expanding max P/E ratio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
