"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";

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
    <div className="glass-panel glow-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <h3 className="font-semibold text-gray-100 text-sm">Watchlist</h3>
      </div>

      {symbols.length === 0 && <p className="text-xs text-muted">Click the star on any stock to add it here.</p>}

      <div className="space-y-1">
        {rows.map((r) => (
          <div
            key={r.symbol}
            className="group flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
            onClick={() => onSelect(r.symbol)}
          >
            <span className="text-sm font-medium text-gray-200">{r.symbol}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-num text-gray-400">{r.price?.toFixed(2)}</span>
              <span className={`text-xs font-semibold font-mono-num ${r.changePercent >= 0 ? "text-up" : "text-down"}`}>
                {r.changePercent >= 0 ? "+" : ""}
                {r.changePercent?.toFixed(2)}%
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(r.symbol);
                }}
                className="opacity-0 group-hover:opacity-100 text-muted hover:text-down transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {loading && rows.length === 0 && <p className="text-xs text-muted">Loading...</p>}
      </div>
    </div>
  );
}
