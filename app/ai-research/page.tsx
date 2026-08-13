import AppPageShell from "@/components/AppPageShell";

const REPORTS = [
  ["Reliance Industries", "Moderately bullish", "A large-cap play with strong cash generation and diversified business exposure."],
  ["TCS", "Stable bullish", "Strong profitability and resilient enterprise demand continue to support the setup."],
  ["HDFC Bank", "Neutral-positive", "Well-capitalized balance sheet, but valuations remain a key watchpoint."],
];

export default function AIResearchPage() {
  return (
    <AppPageShell title="AI Research" subtitle="Understand market drivers, risk factors, and opportunity signals across the Indian equity universe.">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {REPORTS.map(([name, sentiment, summary]) => (
          <div key={name} className="section-card p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-base font-semibold">{name}</h3>
              <span className="pill positive">{sentiment}</span>
            </div>
            <p className="text-sm text-muted">{summary}</p>
          </div>
        ))}
      </div>
    </AppPageShell>
  );
}
