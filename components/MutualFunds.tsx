"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import {
  createChart,
  ColorType,
  IChartApi,
} from "lightweight-charts";

interface Scheme {
  schemeCode: number;
  schemeName: string;
}

export default function MutualFunds() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Scheme[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Scheme | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/mf/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  async function selectScheme(scheme: Scheme) {
    setSelected(scheme);
    setResults([]);
    setQuery("");
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/mf/nav?code=${scheme.schemeCode}`);
      const data = await res.json();
      setDetail(data);
    } finally {
      setLoadingDetail(false);
    }
  }

  useEffect(() => {
    if (!detail?.data || !chartContainerRef.current) return;

    const chart: IChartApi = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#8b96ab" },
      grid: { vertLines: { color: "#1c2333" }, horzLines: { color: "#1c2333" } },
      width: chartContainerRef.current.clientWidth,
      height: 340,
      timeScale: { borderColor: "#232c40" },
      rightPriceScale: { borderColor: "#232c40" },
    });

    const series = chart.addAreaSeries({
      lineColor: "#60a5fa",
      topColor: "rgba(96,165,250,0.3)",
      bottomColor: "rgba(96,165,250,0.02)",
      lineWidth: 2,
    });

    // mfapi returns most-recent-first, DD-MM-YYYY dates
    const points = [...detail.data]
      .reverse()
      .map((p: any) => {
        const [dd, mm, yyyy] = p.date.split("-");
        return { time: `${yyyy}-${mm}-${dd}`, value: parseFloat(p.nav) };
      })
      .filter((p: any) => !isNaN(p.value));

    series.setData(points);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [detail]);

  const latest = detail?.data?.[0];
  const prev = detail?.data?.[1];
  const change = latest && prev ? parseFloat(latest.nav) - parseFloat(prev.nav) : 0;
  const changePct = prev ? (change / parseFloat(prev.nav)) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="glass-panel glow-border p-5">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mutual funds e.g. 'Parag Parikh Flexi Cap', 'Nippon Small Cap'..."
            className="w-full bg-panel2 border border-border rounded-xl pl-10 pr-9 py-2.5 text-sm text-gray-100
                       placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted animate-spin" />}

          {results.length > 0 && (
            <div className="absolute z-30 mt-2 w-full glass-panel glow-border max-h-80 overflow-y-auto">
              {results.map((r) => (
                <button
                  key={r.schemeCode}
                  onClick={() => selectScheme(r)}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-sm text-gray-200 border-b border-border/40 last:border-0"
                >
                  {r.schemeName}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-[11px] text-muted mt-3">
          Data source: AMFI daily NAV via mfapi.in — covers all Indian mutual fund schemes, no key required.
        </p>
      </div>

      {loadingDetail && (
        <div className="glass-panel glow-border p-16 flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 text-accent animate-spin" />
          <p className="text-sm text-muted">Loading NAV history...</p>
        </div>
      )}

      {!loadingDetail && detail?.meta && (
        <div className="glass-panel glow-border p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-semibold text-gray-100">{detail.meta.scheme_name}</h3>
              <p className="text-xs text-muted mt-1">
                {detail.meta.fund_house} · {detail.meta.scheme_category}
              </p>
            </div>
            {latest && (
              <div className="text-right">
                <div className="text-2xl font-bold font-mono-num text-gray-100">₹{parseFloat(latest.nav).toFixed(2)}</div>
                <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${change >= 0 ? "text-up" : "text-down"}`}>
                  {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(2)} ({changePct.toFixed(2)}%)
                </div>
                <p className="text-[10px] text-muted mt-0.5">as of {latest.date}</p>
              </div>
            )}
          </div>
          <div ref={chartContainerRef} className="w-full" />
        </div>
      )}

      {!selected && !loadingDetail && (
        <div className="glass-panel glow-border p-10 text-center">
          <p className="text-sm text-muted">Search above to explore any Indian mutual fund's NAV history.</p>
        </div>
      )}
    </div>
  );
}
