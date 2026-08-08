import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketAI Pro | AI-Powered Stock Analytics",
  description:
    "Real-time stock market analytics with an integrated AI research assistant. Live prices, technical charts, and AI-generated insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-app-gradient min-h-screen">{children}</body>
    </html>
  );
}
