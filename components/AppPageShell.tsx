"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LineChart,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  TrendingUp,
  Compass,
  PieChart,
  DollarSign,
  Brain,
  ArrowUpRight
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";

interface NavGroup {
  label: string;
  href?: string;
  icon: any;
  items?: { href: string; label: string; desc?: string }[];
}

const NAVIGATION: NavGroup[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "Markets",
    icon: TrendingUp,
    items: [
      { href: "/markets", label: "Markets Overview", desc: "Indices, Breadth & Liquidity" },
      { href: "/markets#sectors", label: "Sector Leadership", desc: "Rotation & Sector Signals" },
      { href: "/markets#movers", label: "Market Movers", desc: "Gainers, Losers & Active Volume" },
    ],
  },
  {
    label: "Discover",
    icon: Compass,
    items: [
      { href: "/screener", label: "Stock Screener", desc: "Filter by ROE, P/E & Growth" },
      { href: "/compare", label: "Compare Stocks", desc: "Side-by-Side Fundamentals" },
      { href: "/ai-opportunities", label: "AI Opportunities", desc: "High-Probability Ideas" },
    ],
  },
  {
    label: "Portfolio",
    icon: PieChart,
    items: [
      { href: "/portfolio", label: "My Portfolio", desc: "Positions, P&L & Allocation" },
      { href: "/risk-analysis", label: "Risk Analysis", desc: "Beta, Volatility & Concentration" },
    ],
  },
  {
    label: "Investments",
    icon: DollarSign,
    items: [
      { href: "/mutual-funds", label: "Mutual Funds", desc: "AMFI Scheme NAV History" },
      { href: "/ipo-intelligence", label: "IPOs", desc: "NSE Subscription & GMP" },
    ],
  },
  {
    label: "AI Research",
    href: "/ai-research",
    icon: Brain,
  },
];

export default function AppPageShell({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="min-h-screen app-shell">
      <header className="topbar">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand Mark */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="brand-mark group-hover:scale-105 transition-transform">
              <LineChart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="brand-title flex items-center gap-1.5">
                MarketAI Pro <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-primary-soft text-primary border border-primary/20">PRO</span>
              </h1>
              <p className="brand-subtitle hidden lg:block">AI-powered financial intelligence for the Indian market.</p>
            </div>
          </Link>

          {/* Grouped Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1" ref={dropdownRef}>
            {NAVIGATION.map((group) => {
              if (group.href) {
                const isActive = pathname === group.href;
                return (
                  <Link
                    key={group.label}
                    href={group.href}
                    className={`nav-link ${isActive ? "active" : ""}`}
                  >
                    <span>{group.label}</span>
                  </Link>
                );
              }

              const isOpen = openDropdown === group.label;
              const hasActiveChild = group.items?.some((i) => pathname === i.href);

              return (
                <div key={group.label} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : group.label)}
                    className={`nav-link ${hasActiveChild || isOpen ? "active" : ""}`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180 text-primary" : "text-muted"}`} />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full mt-2 w-64 glass-panel glow-border p-2 z-50 animate-fade-in shadow-2xl space-y-1">
                      {group.items?.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setOpenDropdown(null)}
                          className={`flex items-start justify-between p-2.5 rounded-xl transition-colors ${
                            pathname === sub.href ? "bg-primary-soft text-foreground font-bold" : "hover:bg-card-strong text-muted hover:text-foreground"
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-foreground">{sub.label}</div>
                            {sub.desc && <div className="text-[10px] text-muted mt-0.5">{sub.desc}</div>}
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-muted opacity-50 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Search, Theme Toggle & Mobile Trigger */}
          <div className="flex items-center gap-2.5 flex-1 justify-end max-w-md">
            <div className="hidden sm:block w-full max-w-xs">
              <SearchBar placeholder="Search stocks, funds, IPOs..." />
            </div>
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl border border-border bg-card-strong text-foreground xl:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sheet */}
        {mobileOpen && (
          <div className="xl:hidden px-4 pb-4 border-t border-border pt-3 bg-card/95 backdrop-blur-md animate-fade-in space-y-3">
            <div className="sm:hidden">
              <SearchBar placeholder="Search stocks, funds, IPOs..." />
            </div>
            <nav className="space-y-2">
              {NAVIGATION.map((group) => (
                <div key={group.label} className="space-y-1">
                  {group.href ? (
                    <Link
                      href={group.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block p-2.5 rounded-xl text-xs font-bold ${pathname === group.href ? "bg-primary-soft text-primary" : "text-foreground hover:bg-card-strong"}`}
                    >
                      {group.label}
                    </Link>
                  ) : (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted px-2 py-1">{group.label}</div>
                      <div className="pl-2 space-y-1">
                        {group.items?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setMobileOpen(false)}
                            className={`block p-2 rounded-lg text-xs font-semibold ${pathname === sub.href ? "text-primary font-bold" : "text-muted hover:text-foreground"}`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 lg:py-8">
        {title && (
          <section className="hero-panel mb-6 animate-fade-in">
            <div className="eyebrow-row">
              <span className="status-dot" /> Market Intelligence & Technical Signals
            </div>
            <h2 className="hero-title">{title}</h2>
            {subtitle && <p className="hero-subtitle">{subtitle}</p>}
          </section>
        )}
        {children}
      </div>
    </main>
  );
}
