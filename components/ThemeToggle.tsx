"use client";

import { useEffect, useState, useRef } from "react";
import { Palette, SunMedium, MoonStar, Monitor, Check, Sparkles } from "lucide-react";

const themes = [
  { value: "midnight", label: "Midnight (Default)" },
  { value: "dark", label: "Pure Dark" },
  { value: "light", label: "Clean Light" },
  { value: "slate", label: "Slate Blue" },
  { value: "aurora", label: "Aurora Teal" },
  { value: "emerald", label: "Emerald Green" },
];

const modes = [
  { value: "dark", label: "Dark Mode", icon: MoonStar },
  { value: "light", label: "Light Mode", icon: SunMedium },
  { value: "system", label: "System Default", icon: Monitor },
];

const accents = [
  { value: "blue", label: "Blue", color: "#3b82f6" },
  { value: "purple", label: "Purple", color: "#8b5cf6" },
  { value: "cyan", label: "Cyan", color: "#06b6d4" },
  { value: "emerald", label: "Emerald", color: "#10b981" },
  { value: "orange", label: "Orange", color: "#f97316" },
  { value: "rose", label: "Rose", color: "#f43f5e" },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState("midnight");
  const [mode, setMode] = useState("dark");
  const [accent, setAccent] = useState("blue");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("marketai_theme") || "midnight";
    const savedMode = localStorage.getItem("marketai_mode") || "dark";
    const savedAccent = localStorage.getItem("marketai_accent") || "blue";

    setTheme(savedTheme);
    setMode(savedMode);
    setAccent(savedAccent);

    applyToDOM(savedTheme, savedMode, savedAccent);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function applyToDOM(t: string, m: string, a: string) {
    document.documentElement.setAttribute("data-theme", t);
    document.documentElement.setAttribute("data-mode", m);
    document.documentElement.setAttribute("data-accent", a);
  }

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("marketai_theme", newTheme);
    applyToDOM(newTheme, mode, accent);
  };

  const updateMode = (newMode: string) => {
    setMode(newMode);
    localStorage.setItem("marketai_mode", newMode);

    let effectiveTheme = theme;
    if (newMode === "light") effectiveTheme = "light";
    else if (newMode === "dark" && theme === "light") effectiveTheme = "midnight";

    setTheme(effectiveTheme);
    localStorage.setItem("marketai_theme", effectiveTheme);
    applyToDOM(effectiveTheme, newMode, accent);
  };

  const updateAccent = (newAccent: string) => {
    setAccent(newAccent);
    localStorage.setItem("marketai_accent", newAccent);
    applyToDOM(theme, mode, newAccent);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 rounded-xl border border-border bg-card-strong text-foreground flex items-center justify-center hover:border-primary/40 transition-colors"
        aria-label="Customize theme & appearance"
        title="Customize Theme & Colors"
      >
        <Palette className="w-4 h-4 text-primary" />
      </button>

      {open && (
        <div className="absolute right-0 top-calc mt-2 w-72 glass-panel glow-border p-4 z-50 animate-fade-in shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <h4 className="text-xs uppercase font-bold text-foreground tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Theme & Accent Controls
            </h4>
          </div>

          {/* Mode Selector */}
          <div>
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1.5">Mode</span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-card-strong border border-border rounded-xl">
              {modes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => updateMode(value)}
                  className={`flex flex-col items-center py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    mode === value ? "bg-primary text-white shadow-sm" : "text-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 mb-0.5" />
                  {label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Presets */}
          <div>
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1.5">Base Theme</span>
            <div className="grid grid-cols-2 gap-1.5">
              {themes.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateTheme(value)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    theme === value
                      ? "border-primary bg-primary-soft text-foreground"
                      : "border-border/60 bg-card-strong text-muted hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{label}</span>
                  {theme === value && <Check className="w-3 h-3 text-primary shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Presets */}
          <div>
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block mb-1.5">Accent Color</span>
            <div className="grid grid-cols-6 gap-1.5">
              {accents.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => updateAccent(value)}
                  style={{ backgroundColor: color }}
                  className={`h-7 rounded-lg border-2 flex items-center justify-center transition-transform ${
                    accent === value ? "border-foreground scale-110 shadow-md" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                  title={label}
                >
                  {accent === value && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
