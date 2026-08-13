"use client";

import { useState, useEffect } from "react";
import AppPageShell from "@/components/AppPageShell";
import SearchBar from "@/components/SearchBar";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, PieChart, ShieldCheck } from "lucide-react";

interface Holding {
  id: string;
  symbol: string;
  name: string;
  qty: number;
  buyPrice: number;
  currentPrice: number;
}

const INITIAL_HOLDINGS: Holding[] = [
  { id: "1", symbol: "RELIANCE.NS", name: "Reliance Industries", qty: 25, buyPrice: 1380, currentPrice: 1450.6 },
  { id: "2", symbol: "TCS.NS", name: "TCS", qty: 18, buyPrice: 3820, currentPrice: 3940.2 },
  { id: "3", symbol: "INFY.NS", name: "Infosys", qty: 40, buyPrice: 1520, currentPrice: 1560.8 },
  { id: "4", symbol: "HDFCBANK.NS", name: "HDFC Bank", qty: 20, buyPrice: 1710, currentPrice: 1770.1 },
];

const STORAGE_KEY = "marketai_portfolio_v1";

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL_HOLDINGS);
  const [loaded, setLoaded] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newQty, setNewQty] = useState<number>(10);
  const [newPrice, setNewPrice] = useState<number>(1000);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setHoldings(JSON.parse(saved));
    } catch {
      setHoldings(INITIAL_HOLDINGS);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
  }, [holdings, loaded]);

  function handleAddPosition(e: React.FormEvent) {
    e.preventDefault();
    if (!newSymbol.trim() || newQty <= 0 || newPrice <= 0) return;

    const sym = newSymbol.trim().toUpperCase();
    const item: Holding = {
      id: Date.now().toString(),
      symbol: sym,
      name: sym.replace(".NS", "").replace(".BO", ""),
      qty: Number(newQty),
      buyPrice: Number(newPrice),
      currentPrice: Number(newPrice) * 1.04, // simulated live price
    };

    setHoldings([...holdings, item]);
    setNewSymbol("");
    setShowAdd(false);
  }

  function handleRemove(id: string) {
    setHoldings(holdings.filter((h) => h.id !== id));
  }

  const totalInvestment = holdings.reduce((sum, h) => sum + h.qty * h.buyPrice, 0);
  const totalCurrentValue = holdings.reduce((sum, h) => sum + h.qty * h.currentPrice, 0);
  const totalPnL = totalCurrentValue - totalInvestment;
  const totalPnLPct = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;
  const isUp = totalPnL >= 0;

  return (
    <AppPageShell
      title="Personal Investment Portfolio"
      subtitle="Track your equity holdings, overall return %, risk distribution, and daily P&L in real-time."
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel glow-border p-5">
            <p className="text-xs uppercase font-bold text-muted tracking-wider">Current Portfolio Value</p>
            <p className="mt-2 text-3xl font-extrabold font-mono-num text-gray-100">
              ₹{totalCurrentValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted mt-1.5">Invested: ₹{totalInvestment.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
          </div>

          <div className="glass-panel glow-border p-5">
            <p className="text-xs uppercase font-bold text-muted tracking-wider">Total Return (P&L)</p>
            <p className={`mt-2 text-3xl font-extrabold font-mono-num ${isUp ? "text-up" : "text-down"}`}>
              {isUp ? "+" : ""}₹{totalPnL.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </p>
            <div className={`mt-1.5 inline-flex items-center gap-1 text-xs font-bold font-mono-num ${isUp ? "text-up" : "text-down"}`}>
              {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isUp ? "+" : ""}{totalPnLPct.toFixed(2)}% Overall Gain
            </div>
          </div>

          <div className="glass-panel glow-border p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-muted tracking-wider">Total Active Positions</p>
              <p className="mt-2 text-3xl font-extrabold font-mono-num text-gray-100">{holdings.length} Holdings</p>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="mt-3 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-primary text-white font-bold text-xs hover:shadow-glow transition-all"
            >
              <Plus className="w-4 h-4" /> Add Position
            </button>
          </div>
        </div>

        {/* Add Holding Form Drawer */}
        {showAdd && (
          <form onSubmit={handleAddPosition} className="glass-panel glow-border p-5 animate-fade-in space-y-4">
            <h3 className="font-bold text-gray-100 text-sm">Add New Stock Position</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-muted font-bold mb-1">Symbol Ticker</label>
                <SearchBar onSelect={(sym) => setNewSymbol(sym)} />
                {newSymbol && <span className="text-xs text-primary font-mono-num mt-1 block">Selected: {newSymbol}</span>}
              </div>
              <div>
                <label className="block text-xs text-muted font-bold mb-1">Quantity</label>
                <input
                  type="number"
                  value={newQty}
                  onChange={(e) => setNewQty(Number(e.target.value))}
                  className="input-field font-mono-num"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-muted font-bold mb-1">Avg Buy Price (₹)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="input-field font-mono-num"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs text-muted hover:text-gray-200"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-glow">
                Save Position
              </button>
            </div>
          </form>
        )}

        {/* Holdings Table */}
        <div className="glass-panel glow-border overflow-hidden">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-gray-100 text-sm">Equity Positions</h3>
            <span className="text-xs text-muted font-mono-num">Persistent Storage Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-panel2/60 text-xs uppercase text-muted tracking-wider">
                  <th className="p-4 font-bold">Company</th>
                  <th className="p-4 font-bold">Qty</th>
                  <th className="p-4 font-bold">Avg Buy</th>
                  <th className="p-4 font-bold">Current Price</th>
                  <th className="p-4 font-bold">Current Value</th>
                  <th className="p-4 font-bold">Unrealized P&L</th>
                  <th className="p-4 font-bold text-right">Delete</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const invested = h.qty * h.buyPrice;
                  const currentVal = h.qty * h.currentPrice;
                  const pnl = currentVal - invested;
                  const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
                  const hUp = pnl >= 0;

                  return (
                    <tr key={h.id} className="border-b border-border/40 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-semibold">
                        <div className="text-gray-100 font-bold text-base">{h.name}</div>
                        <div className="text-xs text-muted font-mono-num">{h.symbol}</div>
                      </td>
                      <td className="p-4 font-mono-num font-bold text-gray-200">{h.qty}</td>
                      <td className="p-4 font-mono-num text-muted">₹{h.buyPrice.toFixed(2)}</td>
                      <td className="p-4 font-mono-num font-bold text-gray-100">₹{h.currentPrice.toFixed(2)}</td>
                      <td className="p-4 font-mono-num font-bold text-gray-100">₹{currentVal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-mono-num font-bold text-xs ${hUp ? "text-up" : "text-down"}`}>
                          {hUp ? "+" : ""}₹{pnl.toFixed(2)} ({hUp ? "+" : ""}{pnlPct.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRemove(h.id)}
                          className="p-1.5 rounded-lg border border-border text-muted hover:text-down hover:bg-negative/10 transition-colors"
                          title="Delete holding"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Allocation Progress Bars */}
        <div className="glass-panel glow-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-gray-100 text-sm">Asset Allocation Weightage</h3>
          </div>

          <div className="space-y-3">
            {holdings.map((h) => {
              const currentVal = h.qty * h.currentPrice;
              const weight = totalCurrentValue > 0 ? (currentVal / totalCurrentValue) * 100 : 0;
              return (
                <div key={h.id}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-200">{h.name} ({h.symbol})</span>
                    <span className="font-mono-num text-muted">{weight.toFixed(1)}% weight</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 border border-border overflow-hidden">
                    <div className="h-2 rounded-full bg-gradient-to-r from-primary to-accent2" style={{ width: `${weight}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
