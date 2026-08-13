import IPOList from "@/components/IPOList";
import AppPageShell from "@/components/AppPageShell";

export default function IPOIntelligencePage() {
  return (
    <AppPageShell title="IPO Intelligence" subtitle="Stay on top of active, upcoming, and recently listed Indian IPOs with an intelligent market lens.">
      <IPOList />
    </AppPageShell>
  );
}
