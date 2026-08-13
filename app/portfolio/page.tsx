import AppPageShell from "@/components/AppPageShell";

const HOLDINGS = [
  ["RELIANCE.NS", "Reliance", 25, 1380, 34500],
  ["TCS.NS", "TCS", 18, 3925, 70700],
  ["INFY.NS", "Infosys", 40, 1550, 62000],
  ["HDFCBANK.NS", "HDFC Bank", 20, 1760, 35200],
];

export default function PortfolioPage() {
  return (
    <AppPageShell title="My Portfolio" subtitle="Track holdings, allocation, and risk in one place.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          ["Portfolio Value", "₹2.03L"],
          ["Today P&L", "+₹6,240"],
          ["Overall Return", "+12.1%"],
        ].map(([label, value]) => (
          <div key={label} className="section-card p-4">
            <div className="text-xs uppercase text-muted">{label}</div>
            <div className="mt-3 text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div className="section-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="p-4">Symbol</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Avg Buy</th>
                <th className="p-4">Current</th>
                <th className="p-4">Value</th>
              </tr>
            </thead>
            <tbody>
              {HOLDINGS.map(([symbol, name, qty, price, value]) => (
                <tr key={symbol} className="border-b border-border/30">
                  <td className="p-4 font-semibold">{name}<div className="text-xs text-muted">{symbol}</div></td>
                  <td className="p-4">{qty}</td>
                  <td className="p-4">₹{Number(price).toFixed(2)}</td>
                  <td className="p-4">₹{Number(price).toFixed(2)}</td>
                  <td className="p-4">₹{Number(value).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppPageShell>
  );
}
