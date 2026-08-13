"use client";

import { useEffect, useState } from "react";
import { Star, X, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

interface Row {
  symbol: string;
  price: number;
  changePercent: number;
}

export default function Watchlist({
  symbols,
  onSelect,
  onRemove,
}: {
  symbols: string[];
  onSelect: (symbol: string) => void;
  onRemove: (symbol: string) => void;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (symbols.length === 0) {
        setRows([]);
        return;
      }
      setLoading(true);
      const results = await Promise.all(
        symbols.map(async (s) => {
          try {
            const res = await fetch(`/api/quote?symbol=${encodeURIComponent(s)}&range=5d&interval=1d`);
            if (!res.ok) return null;
            const d = await res.json();
            return { symbol: s, price: d.regularMarketPrice, changePercent: d.regularMarketChangePercent };
          } catch {
            return null;
          }
        })
      );
      if (mounted) setRows(results.filter(Boolean) as Row[]);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [symbols]);

  return (
    <div className="glass-panel glow-border p-5 animate-fade-in">
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <h3 className="font-bold text-gray-100 text-sm">Watchlist</h3>
        </div>
        <span className="text-[11px] text-muted font-mono-num">{symbols.length} tracked</span>
      </div>

      {symbols.length === 0 && (
        <div className="text-center py-6 border border-dashed border-border rounded-xl">
          <p className="text-xs text-muted">Click the star on any stock header to pin it here.</p>
        </div>
      )}

      <div className="space-y-1.5">
        {rows.map((r) => {
          const isUp = r.changePercent >= 0;
          return (
            <div
              key={r.symbol}
              className="group flex items-center justify-between px-3 py-2 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-white/5 cursor-pointer transition-all"
              onClick={() => onSelect(r.symbol)}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-200 font-mono-num">{r.symbol}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono-num font-semibold text-gray-200">₹{r.price?.toFixed(2)}</span>
                <span className={`text-[11px] font-bold font-mono-num px-1.5 py-0.5 rounded ${isUp ? "bg-positive/10 text-up" : "bg-negative/10 text-down"}`}>
                  {isUp ? "+" : ""}{r.changePercent?.toFixed(2)}%
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(r.symbol);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-muted hover:text-down transition-opacity p-0.5"
                  title="Remove from Watchlist"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        {loading && rows.length === 0 && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted py-4">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> Updating prices...
          </div>
        )}
      </div>
    </div>
  );
}
