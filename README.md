# 📈 MarketAI Pro — AI-Powered Stock Analytics Platform

A production-grade stock market dashboard built with **Next.js 16, TypeScript, Tailwind CSS, and Recharts**, featuring **live market data** and a **built-in AI research assistant powered by Claude**.

> Built by **Tirth Shah** — B.Tech CSE Student, Ahmedabad, India
> 📧 tirthshah2596@gmail.com · 💻 [github.com/tirthshah025](https://github.com/tirthshah025)

---

## ✨ What Makes This Different

MarketAI Pro is focused entirely on the **Indian market** (NSE/BSE) and adds a real AI layer most student dashboards skip:

- 🤖 **AI Chat Assistant** — ask natural-language questions about any stock you're viewing ("Is this overbought?", "Explain MACD") and get a real, context-aware answer from Claude.
- 🧠 **AI Auto-Insights** — every stock automatically gets a generated Bullish/Bearish/Neutral read with a confidence score, a plain-English summary, and bull/bear point lists — regenerated on demand.
- 🕯️ **Real candlestick charts** via [Lightweight Charts](https://github.com/tradingview/lightweight-charts) — TradingView's own open-source charting engine, free, no key, professional-grade rendering (not an approximation built on a generic bar chart library).
- 📡 **Live NSE/BSE data, no paid API key** — prices and OHLCV history come from Yahoo Finance's public endpoints via a Next.js server route (only the AI features need a key).
- 🚀 **IPO tracker** — current and upcoming NSE IPOs (price band, dates, issue size).
- 🐖 **Mutual Funds explorer** — search any Indian mutual fund scheme and view its NAV history, sourced from AMFI data via mfapi.in.
- ⭐ **Persistent watchlist** — saved to the browser (localStorage), survives refreshes, Indian stocks only.
- Scrolling live ticker tape (Nifty 50, Sensex, NSE blue-chips), searchable autocomplete biased to NSE/BSE.

---

## 🗂️ Project Structure

```
market-ai-pro/
├── app/
│   ├── page.tsx              # Main dashboard UI
│   ├── layout.tsx            # Root layout + metadata
│   ├── globals.css           # Dark theme styling
│   └── api/
│       ├── quote/route.ts    # Live price + OHLCV data (Yahoo Finance proxy, NSE/BSE)
│       ├── search/route.ts   # Ticker autocomplete (NSE/BSE only)
│       ├── chat/route.ts     # AI chat assistant (Claude)
│       ├── insights/route.ts # AI auto-generated sentiment insights (Claude)
│       ├── ipo/route.ts      # Current + upcoming NSE IPOs
│       └── mf/
│           ├── search/route.ts  # Mutual fund scheme search
│           └── nav/route.ts     # Mutual fund NAV history
├── components/
│   ├── TickerTape.tsx
│   ├── SearchBar.tsx
│   ├── PriceStats.tsx
│   ├── StockChart.tsx        # Real candlesticks (Lightweight Charts)
│   ├── InsightsCard.tsx      # AI insights panel
│   ├── ChatPanel.tsx         # AI chat panel
│   ├── Watchlist.tsx         # Persisted via localStorage
│   ├── IPOList.tsx
│   └── MutualFunds.tsx
├── lib/
│   ├── yahoo.ts               # Yahoo Finance data-fetching layer
│   ├── mf.ts                  # mfapi.in mutual fund data layer
│   ├── ipo.ts                 # NSE IPO data layer
│   └── types.ts
├── package.json
├── tailwind.config.ts
└── .env.example
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (custom dark fintech theme) |
| Charts | Lightweight Charts (TradingView's open-source engine) |
| Stock Data | Yahoo Finance public endpoints, NSE/BSE (no key needed) |
| Mutual Fund Data | mfapi.in (AMFI daily NAV, no key needed) |
| IPO Data | NSE India unofficial public endpoint |
| AI | Anthropic Claude API (chat + structured insights) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 💻 Local Setup

**Requirements:** Node.js 18+, npm

```bash
# 1. Clone
git clone https://github.com/tirthshah025/market-ai-pro.git
cd market-ai-pro

# 2. Install dependencies
npm install

# 3. Add your Anthropic API key (only needed for AI chat/insights)
cp .env.example .env.local
# then edit .env.local and paste your key:
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx

# 4. Run the dev server
npm run dev
```

Open **http://localhost:3000** — the dashboard loads with AAPL by default. Live prices work immediately; the AI Chat and AI Insight panels activate once `ANTHROPIC_API_KEY` is set.

Get a key at [console.anthropic.com](https://console.anthropic.com/).

---

## ☁️ Deploy to Vercel (Free)

1. Push this project to a **public GitHub repository**.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — no build config needed.
4. Before deploying, add an environment variable:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** your key from console.anthropic.com
5. Click **Deploy**. You'll get a live URL like `https://market-ai-pro.vercel.app`.

### Push to GitHub (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: MarketAI Pro"
git branch -M main
git remote add origin https://github.com/<your-username>/market-ai-pro.git
git push -u origin main
```

---

## 🔎 Usage Notes

- **Ticker formats:** US stocks use plain symbols (`AAPL`, `TSLA`). NSE-listed Indian stocks need the `.NS` suffix (`RELIANCE.NS`, `TCS.NS`). BSE uses `.BO`.
- **Rate limits:** Yahoo Finance's public endpoints are unofficial and unauthenticated — fine for a portfolio project, but avoid hammering them with very high-frequency polling in production.
- **Without an API key**, everything except the AI Chat and AI Insights panels works fully (live prices, charts, search, watchlist).

---

## 🚀 Future Upgrades

- [ ] Streaming AI chat responses (SSE) instead of single-shot replies
- [ ] Multi-stock comparison view (normalized overlay chart)
- [ ] Portfolio tracker with cost basis and P&L
- [ ] News feed integration with AI-summarized headlines per stock
- [ ] Price alerts via email/webhook
- [ ] User accounts so watchlists persist across devices (Supabase/Clerk)
- [ ] Backtesting simple SMA-crossover strategies against historical data

---

## ⚠️ Disclaimer

This project is for **educational and portfolio purposes only**. AI-generated insights are technical commentary based on price data, not financial advice. Market data may be delayed and is sourced from unofficial Yahoo Finance endpoints.

---

## 📄 License

MIT License — free to use, modify, and distribute with attribution.
