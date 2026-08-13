import AppPageShell from "@/components/AppPageShell";
import { Sparkles, TrendingUp, ShieldCheck, Zap } from "lucide-react";

const OPPORTUNITIES = [
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", score: 92, rationale: "Strong commercial vehicle margin expansion + EV leadership.", risk: "Low-Medium" },
  { symbol: "SBIN.NS", name: "State Bank of India", score: 88, rationale: "Expanding Net Interest Margins and historical low NPA provisioning.", risk: "Low" },
  { symbol: "DIXON.NS", name: "Dixon Technologies", score: 85, rationale: "Beneficiary of PLI electronics manufacturing incentives.", risk: "Medium" },
  { symbol: "SUNPHARMA.NS", name: "Sun Pharma", score: 84, rationale: "Specialty portfolio growth in US markets + resilient domestic formulation.", risk: "Low" },
];

export default function AIOpportunitiesPage() {
  return (
    <AppPageShell
      title="AI Opportunities & High-Probability Signals"
      subtitle="Algorithmic equity ideas scored by technical momentum, earnings resilience, and institutional capital flow."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OPPORTUNITIES.map((opp) => (
          <div key={opp.symbol} className="glass-panel glow-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-foreground text-lg">{opp.name}</h3>
                <p className="text-xs text-muted font-mono-num">{opp.symbol}</p>
              </div>
              <span className="text-xs font-bold font-mono-num px-3 py-1 rounded-full bg-positive/10 text-up border border-positive/20 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Score: {opp.score}/100
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed">{opp.rationale}</p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40">
              <span className="text-muted">Risk Profile: <strong className="text-foreground">{opp.risk}</strong></span>
              <a
                href={`/stock/${encodeURIComponent(opp.symbol)}`}
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                Analyze Chart →
              </a>
            </div>
          </div>
        ))}
      </div>
    </AppPageShell>
  );
}
