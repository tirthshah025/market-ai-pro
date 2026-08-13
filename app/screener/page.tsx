import AppPageShell from "@/components/AppPageShell";

const FILTERED = [
  ["RELIANCE.NS", "Reliance", "₹1,450.60", "Large Cap", "15.7%", "23.8"],
  ["HDFCBANK.NS", "HDFC Bank", "₹1,770.10", "Large Cap", "14.9%", "18.4"],
  ["INFY.NS", "Infosys", "₹1,560.80", "Large Cap", "20.2%", "21.1"],
  ["TCS.NS", "TCS", "₹3,940.20", "Large Cap", "26.7%", "29.5"],
];

export default function ScreenerPage() {
  return (
    <AppPageShell title="Stock Screener" subtitle="Filter Indian equities by valuation, quality, growth, and profitability metrics.">
      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-4">
        <aside className="section-card p-4">
          <h3 className="text-base font-semibold mb-4">Filters</h3>
          <div className="space-y-3 text-sm text-muted">
            <div><label className="block mb-1">Market Cap</label><input className="input-field" placeholder="> ₹10,000 Cr" /></div>
            <div><label className="block mb-1">P/E</label><input className="input-field" placeholder="< 30" /></div>
            <div><label className="block mb-1">ROE</label><input className="input-field" placeholder="> 15%" /></div>
            <div><label className="block mb-1">Revenue Growth</label><input className="input-field" placeholder="> 10%" /></div>
          </div>
        </aside>

        <div className="section-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="p-4">Company</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">ROE</th>
                  <th className="p-4">P/E</th>
                </tr>
              </thead>
              <tbody>
                {FILTERED.map(([symbol, name, price, category, roe, pe]) => (
                  <tr key={symbol} className="border-b border-border/30">
                    <td className="p-4 font-semibold">{name}<div className="text-xs text-muted">{symbol}</div></td>
                    <td className="p-4">{price}</td>
                    <td className="p-4">{category}</td>
                    <td className="p-4">{roe}</td>
                    <td className="p-4">{pe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
