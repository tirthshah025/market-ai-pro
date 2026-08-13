"use client";

import { useEffect, useState } from "react";
import { Palette, SunMedium, MoonStar, Monitor } from "lucide-react";

const themes = [
  { value: "midnight", label: "Midnight", icon: MoonStar },
  { value: "light", label: "Light", icon: SunMedium },
  { value: "slate", label: "Slate", icon: Palette },
  { value: "aurora", label: "Aurora", icon: Palette },
  { value: "emerald", label: "Emerald", icon: Palette },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState("midnight");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("marketai-theme") || "midnight";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const applyTheme = (nextTheme: string) => {
    setTheme(nextTheme);
    localStorage.setItem("marketai-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="theme-toggle"
        aria-label="Choose theme"
      >
        {theme === "light" ? <SunMedium className="w-4 h-4" /> : theme === "midnight" ? <MoonStar className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
      </button>

      {open && (
        <div className="theme-menu">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => applyTheme(value)}
              className={`theme-menu-item ${theme === value ? "active" : ""}`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
