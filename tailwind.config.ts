import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#05070c",
        panel: "#0d1220",
        panel2: "#121826",
        border: "#1c2333",
        up: "#22c55e",
        down: "#ef4444",
        accent: "#60a5fa",
        accent2: "#a78bfa",
        muted: "#8b96ab",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(96,165,250,0.25)",
        card: "0 4px 20px rgba(0,0,0,0.4)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
