"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
} from "lightweight-charts";
import { Candle } from "@/lib/types";

/**
 * Professional candlestick + volume chart rendered with TradingView's own
 * open-source "Lightweight Charts" library — the same engine that powers
 * TradingView itself. Free, no API key, real OHLC candles.
 */
export default function StockChart({ data }: { data: Candle[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#8b96ab",
        fontFamily: "'JetBrains Mono', monospace",
      },
      grid: {
        vertLines: { color: "#1c2333" },
        horzLines: { color: "#1c2333" },
      },
      width: containerRef.current.clientWidth,
      height: 460,
      timeScale: { borderColor: "#232c40", timeVisible: true },
      rightPriceScale: { borderColor: "#232c40" },
      crosshair: { mode: 0 },
    });
    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });

    const sma20Series = chart.addLineSeries({
      color: "#60a5fa",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    const sma50Series = chart.addLineSeries({
      color: "#f59e0b",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const sorted = [...data].sort((a, b) => (a.time < b.time ? -1 : 1));

    candleSeries.setData(
      sorted.map((c) => ({ time: c.time, open: c.open, high: c.high, low: c.low, close: c.close }))
    );
    volumeSeries.setData(
      sorted.map((c) => ({
        time: c.time,
        value: c.volume,
        color: c.close >= c.open ? "#22c55e55" : "#ef444455",
      }))
    );
    sma20Series.setData(
      sorted.filter((c) => c.sma20 != null).map((c) => ({ time: c.time, value: c.sma20 as number }))
    );
    sma50Series.setData(
      sorted.filter((c) => c.sma50 != null).map((c) => ({ time: c.time, value: c.sma50 as number }))
    );

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={containerRef} className="w-full" />;
}
