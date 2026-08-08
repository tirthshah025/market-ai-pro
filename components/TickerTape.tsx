"use client";

import { useEffect, useState } from "react";

interface TapeItem {
  symbol: string;
  price: number;
  changePercent: number;
}

const TAPE_SYMBOLS = [
  "^NSEI", "^BSESN", "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS",
  "INFY.NS", "ICICIBANK.NS", "SBIN.NS", "ITC.NS", "TATAMOTORS.NS",
  "ADANIENT.NS", "BAJFINANCE.NS",
];

export default function TickerTape() {
  const [items, setItems] = useState<TapeItem[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const results = await Promise.all(
        TAPE_SYMBOLS.map(async (s) => {
          try {
            const res = await fetch(`/api/quote?symbol=${encodeURIComponent(s)}&range=5d&interval=1d`);
            if (!res.ok) return null;
            const d = await res.json();
            return {
              symbol: s.replace("^NSEI", "NIFTY 50").replace("^BSESN", "SENSEX"),
              price: d.regularMarketPrice,
              changePercent: d.regularMarketChangePercent,
            };
          } catch {
            return null;
          }
        })
      );
      if (mounted) setItems(results.filter(Boolean) as TapeItem[]);
    }
    load();
    const interval = setInterval(load, 60000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (items.length === 0) {
    return <div className="h-10 border-b border-border bg-panel/60" />;
  }

  const doubled = [...items, ...items];

  return (
    <div className="h-10 border-b border-border bg-panel/60 overflow-hidden relative">
      <div className="flex items-center h-full whitespace-nowrap animate-marquee">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-4 text-sm font-mono-num">
            <span className="text-muted">{item.symbol}</span>
            <span className="text-gray-200">{item.price?.toFixed(2)}</span>
            <span className={item.changePercent >= 0 ? "text-up" : "text-down"}>
              {item.changePercent >= 0 ? "▲" : "▼"} {Math.abs(item.changePercent).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
