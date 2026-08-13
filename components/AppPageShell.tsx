"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LineChart, Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/markets", label: "Markets" },
  { href: "/compare", label: "Compare" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/mutual-funds", label: "Investments" },
  { href: "/ai-research", label: "AI Research" },
  { href: "/screener", label: "Screener" },
  { href: "/ipo-intelligence", label: "IPOs" },
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
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSearchSelect(symbol: string) {
    router.push(`/?symbol=${encodeURIComponent(symbol)}`);
  }

  return (
    <main className="min-h-screen app-shell">
      <header className="topbar">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 min-w-0 group">
            <div className="brand-mark group-hover:scale-105 transition-transform">
              <LineChart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="brand-title flex items-center gap-1.5">
                MarketAI Pro <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">v2.0</span>
              </h1>
              <p className="brand-subtitle hidden sm:block">AI-powered financial intelligence for the Indian market.</p>
            </div>
          </Link>

          <nav className="main-nav hidden xl:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={active ? "active" : ""}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block w-64 md:w-80">
              <SearchBar onSelect={handleSearchSelect} />
            </div>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-nav-button xl:hidden"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sheet */}
        {mobileMenuOpen && (
          <div className="xl:hidden px-4 pb-4 animate-fade-in border-t border-border pt-3 bg-panel/95 backdrop-blur-md">
            <div className="mb-3 sm:hidden">
              <SearchBar onSelect={(sym) => { handleSearchSelect(sym); setMobileMenuOpen(false); }} />
            </div>
            <nav className="mobile-nav-sheet">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-link justify-between ${pathname === item.href ? "font-bold text-primary bg-primary/10" : ""}`}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted" />
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6 lg:py-8">
        <section className="hero-panel mb-6 animate-fade-in">
          <div className="eyebrow-row">
            <span className="status-dot" /> Real-Time Analytics & Technical Signals
          </div>
          <h2 className="hero-title text-3xl sm:text-4xl md:text-5xl mt-3 text-gray-100 font-extrabold tracking-tight">
            {title}
          </h2>
          <p className="hero-subtitle mt-2 text-muted text-sm sm:text-base max-w-3xl">
            {subtitle}
          </p>
        </section>
        {children}
      </div>
    </main>
  );
}
