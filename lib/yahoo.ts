import { Candle, QuoteData, SearchResult } from "./types";

const CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart";
const QUOTE_SUMMARY_URL = "https://query2.finance.yahoo.com/v10/finance/quoteSummary";
const SEARCH_URL = "https://query2.finance.yahoo.com/v1/finance/search";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
};

function sma(values: number[], window: number, idx: number): number | undefined {
  if (idx < window - 1) return undefined;
  let sum = 0;
  for (let i = idx - window + 1; i <= idx; i++) sum += values[i];
  return sum / window;
}

/**
 * Fetch OHLCV history + live quote fields for a ticker using Yahoo Finance's
 * public chart endpoint. No API key required.
 */
async function fetchChartRaw(symbol: string, range: string, interval: string) {
  const url = `${CHART_URL}/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=false`;
  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 30 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.chart?.result?.[0] || null;
}

export async function fetchQuote(
  symbol: string,
  range: string = "6mo",
  interval: string = "1d"
): Promise<QuoteData | null> {
  let result = await fetchChartRaw(symbol, range, interval);
  let resolvedSymbol = symbol;

  // Indices (^NSEI etc.) and already-suffixed symbols pass through as-is.
  // Bare tickers (e.g. "RELIANCE") get auto-resolved against NSE, then BSE.
  if (!result && !symbol.startsWith("^") && !symbol.includes(".")) {
    for (const suffix of [".NS", ".BO"]) {
      result = await fetchChartRaw(symbol + suffix, range, interval);
      if (result) {
        resolvedSymbol = symbol + suffix;
        break;
      }
    }
  }

  if (!result) return null;
  symbol = resolvedSymbol;

  const meta = result.meta;
  const timestamps: number[] = result.timestamp || [];
  const quote = result.indicators?.quote?.[0] || {};
  const closes: number[] = quote.close || [];

  const candles: Candle[] = timestamps
    .map((t: number, i: number) => {
      const close = closes[i];
      if (close == null) return null;
      return {
        time: new Date(t * 1000).toISOString().slice(0, 10),
        open: quote.open?.[i] ?? close,
        high: quote.high?.[i] ?? close,
        low: quote.low?.[i] ?? close,
        close,
        volume: quote.volume?.[i] ?? 0,
      } as Candle;
    })
    .filter(Boolean) as Candle[];

  const closeSeries = candles.map((c) => c.close);
  candles.forEach((c, i) => {
    c.sma20 = sma(closeSeries, 20, i);
    c.sma50 = sma(closeSeries, 50, i);
  });

  let extra: any = {};
  try {
    const sumUrl = `${QUOTE_SUMMARY_URL}/${encodeURIComponent(
      symbol
    )}?modules=summaryDetail,assetProfile,defaultKeyStatistics,price`;
    const sumRes = await fetch(sumUrl, { headers: HEADERS, next: { revalidate: 300 } });
    if (sumRes.ok) {
      const sumJson = await sumRes.json();
      extra = sumJson?.quoteSummary?.result?.[0] || {};
    }
  } catch {
    // non-fatal — chart data is still usable without fundamentals
  }

  const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? candles[candles.length - 2]?.close ?? 0;
  const price = meta.regularMarketPrice ?? candles[candles.length - 1]?.close ?? 0;
  const change = price - prevClose;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;

  return {
    symbol: meta.symbol,
    shortName: extra.price?.shortName || meta.symbol,
    longName: extra.price?.longName,
    currency: meta.currency || "USD",
    exchange: meta.exchangeName || "",
    regularMarketPrice: price,
    regularMarketChange: change,
    regularMarketChangePercent: changePercent,
    regularMarketPreviousClose: prevClose,
    regularMarketOpen: meta.regularMarketOpen ?? candles[candles.length - 1]?.open ?? price,
    regularMarketDayHigh: meta.regularMarketDayHigh ?? candles[candles.length - 1]?.high ?? price,
    regularMarketDayLow: meta.regularMarketDayLow ?? candles[candles.length - 1]?.low ?? price,
    regularMarketVolume: meta.regularMarketVolume ?? candles[candles.length - 1]?.volume ?? 0,
    marketCap: extra.summaryDetail?.marketCap?.raw ?? extra.price?.marketCap?.raw,
    fiftyTwoWeekHigh: extra.summaryDetail?.fiftyTwoWeekHigh?.raw,
    fiftyTwoWeekLow: extra.summaryDetail?.fiftyTwoWeekLow?.raw,
    trailingPE: extra.summaryDetail?.trailingPE?.raw,
    sector: extra.assetProfile?.sector,
    industry: extra.assetProfile?.industry,
    candles,
  };
}

const INDIAN_EXCHANGES = new Set(["NSI", "BSE"]);

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  const url = `${SEARCH_URL}?q=${encodeURIComponent(
    query
  )}&quotesCount=15&newsCount=0&region=IN&lang=en-IN`;
  const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const json = await res.json();
  const quotes = json?.quotes || [];
  return quotes
    .filter((q: any) => q.symbol && (q.shortname || q.longname))
    .filter((q: any) => INDIAN_EXCHANGES.has(q.exchange) || q.symbol.endsWith(".NS") || q.symbol.endsWith(".BO"))
    .map((q: any) => ({
      symbol: q.symbol,
      name: q.shortname || q.longname,
      exchange: q.exchange || "",
      type: q.quoteType || "",
    }));
}

/** Lightweight quote (price + % change only) for movers / watchlist grids. */
export async function fetchQuickQuote(symbol: string) {
  const data = await fetchQuote(symbol, "5d", "1d");
  if (!data) return null;
  return {
    symbol: data.symbol,
    name: data.shortName,
    price: data.regularMarketPrice,
    changePercent: data.regularMarketChangePercent,
  };
}
