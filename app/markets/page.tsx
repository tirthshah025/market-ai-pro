import AppPageShell from "@/components/AppPageShell";
import { TrendingUp, TrendingDown, Activity, PieChart, ShieldAlert, DollarSign } from "lucide-react";

const INDEX_CARDS = [
  { name: "NIFTY 50", value: "24,590.40", change: "+96.20", pct: "+0.39%", positive: true },
  { name: "SENSEX", value: "80,334.10", change: "+280.60", pct: "+0.35%", positive: true },
  { name: "BANK NIFTY", value: "50,430.50", change: "-90.40", pct: "-0.18%", positive: false },
  { name: "NIFTY IT", value: "39,280.20", change: "+145.80", pct: "+0.37%", positive: true },
  { name: "NIFTY PHARMA", value: "21,980.70", change: "+58.50", pct: "+0.27%", positive: true },
];

const SECTORS = [
  { name: "Information Technology", value: 84, change: "+1.82%", positive: true },
  { name: "Pharmaceuticals & Healthcare", value: 74, change: "+1.25%", positive: true },
  { name: "Banking & Financial Services", value: 68, change: "+0.45%", positive: true },
  { name: "Energy & Infrastructure", value: 58, change: "-0.30%", positive: false },
  { name: "Automobiles & Mobility", value: 46, change: "-0.85%", positive: false },
  { name: "Fast Moving Consumer Goods (FMCG)", value: 62, change: "+0.20%", positive: true },
];

export default function MarketsPage() {
  return (
    <AppPageShell
      title="Indian Market Intelligence & Sector Radar"
      subtitle="Track market breadth, sector leadership, FII/DII institutional cash flow, and market volatility across NSE/BSE."
    >
      <div className="space-y-6">
        {/* Market Indices Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {INDEX_CARDS.map((idx) => (
            <div key={idx.name} className="glass-panel glow-border p-4 hover:scale-[1.01] transition-transform">
              <p className="text-xs uppercase font-bold text-muted">{idx.name}</p>
              <p className="mt-2 text-2xl font-extrabold font-mono-num text-gray-100">{idx.value}</p>
              <div
                className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold font-mono-num ${
                  idx.positive ? "bg-positive/10 text-up border border-positive/20" : "bg-negative/10 text-down border border-negative/20"
                }`}
              >
                {idx.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {idx.change} ({idx.pct})
              </div>
            </div>
          ))}
        </div>

        {/* Market Breadth & Institutional Cashflow */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Market Breadth Gauge */}
          <div className="glass-panel glow-border p-6 xl:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-gray-100">Market Breadth Gauge</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 font-mono-num">
                  <span className="text-up">Advancers: 1,420 (62%)</span>
                  <span className="text-down">Decliners: 860 (38%)</span>
                </div>
                <div className="h-3 rounded-full bg-white/5 border border-border overflow-hidden flex">
                  <div className="h-full bg-positive" style={{ width: "62%" }} />
                  <div className="h-full bg-negative" style={{ width: "38%" }} />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-panel2 border border-border space-y-2 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Advance / Decline Ratio</span>
                  <strong className="text-gray-100 font-mono-num">1.65x (Bullish)</strong>
                </div>
                <div className="flex justify-between text-muted">
                  <span>New 52-Week Highs</span>
                  <strong className="text-up font-mono-num">84 Stocks</strong>
                </div>
                <div className="flex justify-between text-muted">
                  <span>New 52-Week Lows</span>
                  <strong className="text-down font-mono-num">12 Stocks</strong>
                </div>
              </div>
            </div>
          </div>

          {/* FII & DII Institutional Cash Flow */}
          <div className="glass-panel glow-border p-6 xl:col-span-2">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent2" />
                <h3 className="text-base font-bold text-gray-100">Institutional Money Flow (FII / DII)</h3>
              </div>
              <span className="text-xs text-muted font-mono-num">Latest Session</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-positive/10 border border-positive/20">
                <p className="text-xs uppercase font-bold text-up mb-1">FII Net Investment</p>
                <p className="text-2xl font-extrabold font-mono-num text-gray-100">+₹1,840 Cr</p>
                <p className="text-[11px] text-muted mt-1">Foreign Portfolio Investors</p>
              </div>

              <div className="p-4 rounded-xl bg-positive/10 border border-positive/20">
                <p className="text-xs uppercase font-bold text-up mb-1">DII Net Investment</p>
                <p className="text-2xl font-extrabold font-mono-num text-gray-100">+₹1,210 Cr</p>
                <p className="text-[11px] text-muted mt-1">Domestic Mutual Funds & Insurers</p>
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-xs uppercase font-bold text-primary mb-1">Net Institutional Inflow</p>
                <p className="text-2xl font-extrabold font-mono-num text-gray-100">+₹3,050 Cr</p>
                <p className="text-[11px] text-muted mt-1">Combined Institutional Activity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Rotation & Sentiment Radar */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="glass-panel glow-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-gray-100">Sector Performance & Leadership</h3>
            </div>

            <div className="space-y-4">
              {SECTORS.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-200">{s.name}</span>
                    <div className="flex items-center gap-2 font-mono-num">
                      <span className={s.positive ? "text-up" : "text-down"}>{s.change}</span>
                      <span className="text-muted">{s.value}% score</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 border border-border/50 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-accent2 transition-all duration-500"
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel glow-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-gray-100">Volatility & Risk Climate</h3>
            </div>

            <div className="space-y-3">
              {[
                ["India VIX (Volatility Index)", "13.42", "-2.15%", "Low Volatility Regime"],
                ["Put/Call Ratio (PCR)", "1.18", "+0.04", "Bullish Put Writing"],
                ["Market Liquidity Index", "High", "Broad-based", "Healthy Trading Volumes"],
                ["Macro Economic Sentiment", "Expanding", "7.2% GDP Rate", "Constructive Growth Outlook"],
              ].map(([metric, value, sub, status]) => (
                <div key={metric} className="flex items-center justify-between p-3 rounded-xl bg-panel2 border border-border">
                  <div>
                    <p className="text-xs font-bold text-gray-200">{metric}</p>
                    <p className="text-[11px] text-muted mt-0.5">{status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold font-mono-num text-gray-100">{value}</p>
                    <p className="text-[11px] font-mono-num text-primary font-semibold">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
