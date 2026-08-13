import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketAI Pro | AI-Powered Financial Intelligence",
  description:
    "AI-powered financial intelligence for the Indian market. Analyze stocks, mutual funds, IPOs and portfolio risk with premium market analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
