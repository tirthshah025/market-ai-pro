export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
}

export interface QuoteData {
  symbol: string;
  shortName: string;
  longName?: string;
  currency: string;
  exchange: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  marketCap?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  trailingPE?: number;
  sector?: string;
  industry?: string;
  candles: Candle[];
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
