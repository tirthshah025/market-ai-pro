"use client";

import { useEffect, useState } from "react";
import { Rocket, ExternalLink, AlertCircle, Loader2 } from "lucide-react";

export default function IPOList() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ipo")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const currentRows: any[] = Array.isArray(data?.current) ? data.current : data?.current?.data || [];
  const upcomingRows: any[] = Array.isArray(data?.upcoming) ? data.upcoming : data?.upcoming?.data || [];
  const blocked = !loading && !currentRows.length && !upcomingRows.length;

  return (
    <div className="space-y-6">
      <div className="glass-panel glow-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-4 h-4 text-accent2" />
          <h3 className="font-semibold text-gray-100 text-sm">Current IPOs — NSE</h3>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-muted text-sm py-6 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Fetching live IPO data...
          </div>
        )}

        {!loading && currentRows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase text-muted border-b border-border">
                  <th className="pb-2 pr-4">Company</th>
                  <th className="pb-2 pr-4">Price Band</th>
                  <th className="pb-2 pr-4">Open</th>
                  <th className="pb-2 pr-4">Close</th>
                  <th className="pb-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-2.5 pr-4 font-medium text-gray-200">{row.companyName || row.symbol || "—"}</td>
                    <td className="py-2.5 pr-4 text-gray-400 font-mono-num">{row.priceBand || row.issuePrice || "—"}</td>
                    <td className="py-2.5 pr-4 text-gray-400">{row.issueStartDate || row.startDate || "—"}</td>
                    <td className="py-2.5 pr-4 text-gray-400">{row.issueEndDate || row.endDate || "—"}</td>
                    <td className="py-2.5 text-gray-400">{row.series || row.issueType || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {blocked && (
          <div className="flex flex-col items-center text-center gap-2 py-8">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            <p className="text-sm text-gray-300">
              NSE's live IPO feed didn't respond right now (their servers block automated requests occasionally).
            </p>
            <a
              href="https://www.nseindia.com/market-data/all-upcoming-issues-ipo"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-accent inline-flex items-center gap-1 hover:underline mt-1"
            >
              View live IPOs directly on NSE <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      <div className="glass-panel glow-border p-5">
        <h3 className="font-semibold text-gray-100 text-sm mb-4">Upcoming IPOs</h3>
        {!loading && upcomingRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase text-muted border-b border-border">
                  <th className="pb-2 pr-4">Company</th>
                  <th className="pb-2 pr-4">Issue Size</th>
                  <th className="pb-2">Dates</th>
                </tr>
              </thead>
              <tbody>
                {upcomingRows.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-white/5">
                    <td className="py-2.5 pr-4 font-medium text-gray-200">{row.companyName || row.symbol || "—"}</td>
                    <td className="py-2.5 pr-4 text-gray-400 font-mono-num">{row.issueSize || "—"}</td>
                    <td className="py-2.5 text-gray-400">{row.issueStartDate || "—"} – {row.issueEndDate || "—"}</td>
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
