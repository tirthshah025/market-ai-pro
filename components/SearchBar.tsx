"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { SearchResult } from "@/lib/types";

export default function SearchBar({ onSelect }: { onSelect: (symbol: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      onSelect(query.trim().toUpperCase());
      setOpen(false);
    }
  }

  return (
    <div className="relative w-full max-w-md" ref={boxRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search AAPL, TSLA, RELIANCE.NS..."
          className="w-full bg-panel2 border border-border rounded-xl pl-10 pr-9 py-2.5 text-sm
                     text-gray-100 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted animate-spin" />}
      </form>

      {open && results.length > 0 && (
        <div className="absolute z-30 mt-2 w-full glass-panel glow-border overflow-hidden animate-fade-in">
          {results.map((r) => (
            <button
              key={r.symbol}
              onClick={() => {
                onSelect(r.symbol);
                setQuery("");
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 text-left transition-colors"
            >
              <div>
                <div className="text-sm font-semibold text-gray-100">{r.symbol}</div>
                <div className="text-xs text-muted truncate max-w-[220px]">{r.name}</div>
              </div>
              <span className="text-[10px] uppercase tracking-wide text-muted bg-white/5 px-2 py-1 rounded-md">
                {r.exchange}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
