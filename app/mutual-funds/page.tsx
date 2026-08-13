import MutualFunds from "@/components/MutualFunds";
import AppPageShell from "@/components/AppPageShell";

export default function MutualFundsPage() {
  return (
    <AppPageShell title="Mutual Fund Explorer" subtitle="Compare schemes, review NAV history, and track key fund metrics across equity and debt categories.">
      <MutualFunds />
    </AppPageShell>
  );
}
