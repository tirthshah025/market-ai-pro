import AppPageShell from "@/components/AppPageShell";

const STOCKS = [
  ["RELIANCE.NS", "Reliance", "₹1,450.60", "+2.65%", "₹18.7T"],
  ["TCS.NS", "TCS", "₹3,940.20", "+1.82%", "₹12.1T"],
  ["INFY.NS", "Infosys", "₹1,560.80", "+1.44%", "₹7.8T"],
  ["HDFCBANK.NS", "HDFC Bank", "₹1,770.10", "+0.92%", "₹11.4T"],
];

export default function ComparePage() {
  return (
    <AppPageShell title="Compare Stocks" subtitle="Evaluate key fundamentals side by side and identify relative strength across key Indian companies.">
      <div className="section-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="p-4">Company</th>
                <th className="p-4">Price</th>
                <th className="p-4">1D</th>
                <th className="p-4">Market Cap</th>
                <th className="p-4">P/E</th>
                <th className="p-4">ROE</th>
              </tr>
            </thead>
            <tbody>
              {STOCKS.map(([symbol, name, price, change, cap]) => (
                <tr key={symbol} className="border-b border-border/30">
                  <td className="p-4 font-semibold">{name}<div className="text-xs text-muted">{symbol}</div></td>
                  <td className="p-4">{price}</td>
                  <td className="p-4"><span className="pill positive">{change}</span></td>
                  <td className="p-4">{cap}</td>
                  <td className="p-4">22.8</td>
                  <td className="p-4">15.7%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppPageShell>
  );
}
