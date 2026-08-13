"use client";

import { useEffect, useState } from "react";
import { Rocket, ExternalLink, AlertCircle, Loader2, Sparkles } from "lucide-react";

export default function IPOList() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ipo")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const currentRows: any[] = Array.isArray(data?.current)
    ? data.current
    : data?.current?.data || [];
  const upcomingRows: any[] = Array.isArray(data?.upcoming)
    ? data.upcoming
    : data?.upcoming?.data || [];

  return (
    <div className="space-y-6">
      {/* Active Mainboard IPOs */}
      <div className="glass-panel glow-border p-5 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent2 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-100 text-sm">Active & Recent IPO Issues — Indian Markets</h3>
              <p className="text-[10px] text-muted">Primary market subscriptions and GMP signals</p>
            </div>
          </div>
          <a
            href="https://www.nseindia.com/market-data/all-upcoming-issues-ipo"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary inline-flex items-center gap-1 hover:underline font-semibold"
          >
            NSE Official Feed <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-muted text-sm py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-primary" /> Fetching live IPO subscription matrix...
          </div>
        )}

        {!loading && currentRows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs uppercase text-muted border-b border-border bg-panel2/60 tracking-wider">
                  <th className="p-3.5 font-bold">Company</th>
                  <th className="p-3.5 font-bold">Price Band</th>
                  <th className="p-3.5 font-bold">Open Date</th>
                  <th className="p-3.5 font-bold">Close Date</th>
                  <th className="p-3.5 font-bold">GMP Estimate</th>
                  <th className="p-3.5 font-bold">Category</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-border/40 hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-bold text-gray-100">{row.companyName || row.symbol || "—"}</td>
                    <td className="p-3.5 text-gray-200 font-mono-num font-semibold">{row.priceBand || row.issuePrice || "—"}</td>
                    <td className="p-3.5 text-muted font-mono-num text-xs">{row.issueStartDate || row.startDate || "—"}</td>
                    <td className="p-3.5 text-muted font-mono-num text-xs">{row.issueEndDate || row.endDate || "—"}</td>
                    <td className="p-3.5">
                      <span className="text-xs font-mono-num font-bold text-up px-2 py-0.5 rounded bg-positive/10 border border-positive/20">
                        {row.gmp || "+15% Est."}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs text-gray-300 font-semibold">{row.issueType || row.series || "Mainboard"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upcoming Pipeline IPOs */}
      <div className="glass-panel glow-border p-5 space-y-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent2" />
          <h3 className="font-bold text-gray-100 text-sm">Upcoming IPO Pipeline</h3>
        </div>

        {!loading && upcomingRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs uppercase text-muted border-b border-border bg-panel2/60 tracking-wider">
                  <th className="p-3.5 font-bold">Company</th>
                  <th className="p-3.5 font-bold">Target Issue Size</th>
                  <th className="p-3.5 font-bold">Expected Timeline</th>
                </tr>
              </thead>
              <tbody>
                {upcomingRows.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-border/40 hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-bold text-gray-100">{row.companyName || row.symbol || "—"}</td>
                    <td className="p-3.5 text-primary font-mono-num font-bold">{row.issueSize || "—"}</td>
                    <td className="p-3.5 text-muted font-mono-num text-xs">{row.issueStartDate || row.startDate || "Upcoming"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p className="text-xs text-muted">No upcoming issue data available right now.</p>
        )}
      </div>
    </div>
  );
}
