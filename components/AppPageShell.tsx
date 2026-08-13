import Link from "next/link";
import { Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/markets", label: "Markets" },
  { href: "/compare", label: "Compare" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/mutual-funds", label: "Investments" },
  { href: "/ai-research", label: "AI Research" },
];

export default function AppPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen app-shell">
      <header className="topbar">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="brand-mark">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="brand-title">MarketAI Pro</h1>
              <p className="brand-subtitle">AI-powered financial intelligence for the Indian market.</p>
            </div>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={item.href === "/" ? "active" : ""}>
                {item.label}
              </Link>
            ))}
          </nav>

          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
        <section className="hero-panel mb-6">
          <div className="eyebrow-row"><span className="status-dot" /> Market intelligence</div>
          <h2 className="hero-title text-4xl md:text-5xl mt-4">{title}</h2>
          <p className="hero-subtitle mt-3">{subtitle}</p>
        </section>
        {children}
      </div>
    </main>
  );
}
