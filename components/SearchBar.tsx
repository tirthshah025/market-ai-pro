"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import { SearchResult } from "@/lib/types";

export default function SearchBar({
  onSelect,
  placeholder = "Search stocks, mutual funds, IPOs...",
}: {
  onSelect?: (symbol: string) => void;
  placeholder?: string;
}) {
  const router = useRouter();
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
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  function handleChoice(symbol: string) {
    setQuery("");
    setOpen(false);
    if (onSelect) {
      onSelect(symbol);
    } else {
      router.push(`/stock/${encodeURIComponent(symbol)}`);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      handleChoice(query.trim().toUpperCase());
    }
  }

  return (
    <div className="relative w-full" ref={boxRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full input-field pl-10 pr-9 py-2.5 text-xs sm:text-sm font-medium"
        />
        {loading ? (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </form>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full glass-panel glow-border max-h-72 overflow-y-auto animate-fade-in shadow-2xl">
          {results.map((r) => (
            <button
              key={r.symbol}
              onClick={() => handleChoice(r.symbol)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-primary-soft text-left transition-colors border-b border-border/40 last:border-0"
            >
              <div>
                <div className="text-xs sm:text-sm font-bold text-foreground font-mono-num">{r.symbol}</div>
                <div className="text-[11px] text-muted truncate max-w-[220px]">{r.name}</div>
              </div>
              <span className="text-[10px] uppercase font-semibold text-muted bg-card-strong border border-border px-2 py-0.5 rounded">
                {r.exchange || "NSE"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
