import AppPageShell from "@/components/AppPageShell";

const INDEX_CARDS = [
  ["NIFTY 50", "24,590.40", "+96.20", "+0.39%"],
  ["SENSEX", "80,334.10", "+280.60", "+0.35%"],
  ["BANK NIFTY", "50,430.50", "-90.40", "-0.18%"],
  ["NIFTY IT", "39,280.20", "+145.80", "+0.37%"],
  ["NIFTY PHARMA", "21,980.70", "+58.50", "+0.27%"],
];

export default function MarketsPage() {
  return (
    <AppPageShell title="Markets" subtitle="Track market breadth, sector leadership, and capital flow across the Indian market.">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {INDEX_CARDS.map(([name, value, change, pct]) => (
          <div key={name} className="section-card p-4">
            <p className="text-xs uppercase text-muted">{name}</p>
            <p className="mt-3 text-2xl font-bold">{value}</p>
            <div className={`mt-3 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${change.startsWith("+") ? "pill positive" : "pill negative"}`}>
              {change} {pct}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
        <div className="section-card p-5">
          <h3 className="text-lg font-semibold mb-3">Sector Rotation</h3>
          <div className="space-y-3">
            {[
              ["IT", 82],
              ["Banking", 68],
              ["Energy", 56],
              ["Auto", 44],
              ["Pharma", 71],
            ].map(([sector, value]) => (
              <div key={sector}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{sector}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card p-5">
          <h3 className="text-lg font-semibold mb-3">Market Sentiment</h3>
          <div className="space-y-3 text-sm text-muted">
            <div className="flex justify-between"><span>Advance/Decline</span><strong className="text-foreground">1.28x</strong></div>
            <div className="flex justify-between"><span>Volatility</span><strong className="text-foreground">Moderate</strong></div>
            <div className="flex justify-between"><span>Participation</span><strong className="text-foreground">Broad-based</strong></div>
            <div className="flex justify-between"><span>Risk appetite</span><strong className="text-foreground">Improving</strong></div>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
