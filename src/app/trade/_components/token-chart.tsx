"use client";

import { robotoMono } from "@zohal/app/_helpers/fonts";
// TODO @YohanTz: Add NOTICE file mentioning Trading view for using their chart library
import { ColorType, CrosshairMode, createChart } from "lightweight-charts";
import React, { useEffect, useRef } from "react";

/**
 * TODO @YohanTz: Handle different time zones
 * https://tradingview.github.io/lightweight-charts/docs/time-zones
 */
const data = [
  { close: 54.9, high: 55.5, low: 54.52, open: 54.62, time: "2023-10-19" },
  { close: 54.98, high: 55.27, low: 54.61, open: 55.08, time: "2023-10-22" },
  { close: 57.21, high: 57.47, low: 56.09, open: 56.09, time: "2023-10-23" },
  { close: 57.42, high: 58.44, low: 56.41, open: 57.0, time: "2023-10-24" },
  { close: 56.43, high: 57.63, low: 56.17, open: 57.46, time: "2023-10-25" },
  { close: 55.51, high: 56.62, low: 55.19, open: 56.26, time: "2023-10-26" },
  { close: 56.48, high: 57.15, low: 55.72, open: 55.81, time: "2023-10-29" },
  { close: 58.18, high: 58.8, low: 56.92, open: 56.92, time: "2023-10-30" },
  { close: 57.09, high: 58.32, low: 56.76, open: 58.32, time: "2023-10-31" },
  { close: 56.05, high: 57.28, low: 55.55, open: 56.98, time: "2023-11-01" },
  { close: 56.63, high: 57.08, low: 55.92, open: 56.34, time: "2023-11-02" },
  { close: 57.21, high: 57.45, low: 56.51, open: 56.51, time: "2023-11-05" },
  { close: 57.21, high: 57.35, low: 56.65, open: 57.02, time: "2023-11-06" },
  { close: 57.65, high: 57.78, low: 57.03, open: 57.55, time: "2023-11-07" },
  { close: 58.27, high: 58.44, low: 57.66, open: 57.7, time: "2023-11-08" },
  { close: 58.46, high: 59.2, low: 57.94, open: 58.32, time: "2023-11-09" },
  { close: 58.72, high: 59.4, low: 58.54, open: 58.84, time: "2023-11-12" },
  { close: 58.66, high: 59.14, low: 58.32, open: 59.09, time: "2023-11-13" },
  { close: 58.94, high: 59.32, low: 58.41, open: 59.13, time: "2023-11-14" },
  { close: 59.08, high: 59.09, low: 58.45, open: 58.85, time: "2023-11-15" },
  { close: 60.21, high: 60.39, low: 58.91, open: 59.06, time: "2023-11-16" },
  { close: 60.62, high: 61.32, low: 60.18, open: 60.25, time: "2023-11-19" },
  { close: 59.46, high: 61.58, low: 59.17, open: 61.03, time: "2023-11-20" },
  { close: 59.16, high: 59.9, low: 58.88, open: 59.26, time: "2023-11-21" },
  { close: 58.64, high: 59.0, low: 58.29, open: 58.86, time: "2023-11-23" },
  { close: 59.17, high: 59.51, low: 58.31, open: 58.64, time: "2023-11-26" },
  { close: 60.65, high: 60.7, low: 59.18, open: 59.21, time: "2023-11-27" },
  { close: 60.06, high: 60.73, low: 59.64, open: 60.7, time: "2023-11-28" },
  { close: 59.45, high: 59.79, low: 59.26, open: 59.42, time: "2023-11-29" },
  { close: 60.3, high: 60.37, low: 59.48, open: 59.57, time: "2023-11-30" },
  { close: 58.16, high: 59.75, low: 57.69, open: 59.5, time: "2023-12-03" },
  { close: 58.09, high: 59.4, low: 57.96, open: 58.1, time: "2023-12-04" },
  { close: 58.08, high: 58.64, low: 57.16, open: 58.18, time: "2023-12-06" },
  { close: 57.68, high: 58.43, low: 57.34, open: 57.91, time: "2023-12-07" },
  { close: 58.27, high: 58.37, low: 56.87, open: 57.8, time: "2023-12-10" },
  { close: 58.85, high: 59.4, low: 58.63, open: 58.77, time: "2023-12-11" },
  { close: 57.25, high: 58.19, low: 57.23, open: 57.79, time: "2023-12-12" },
  { close: 57.09, high: 57.5, low: 56.81, open: 57.0, time: "2023-12-13" },
  { close: 57.08, high: 57.5, low: 56.75, open: 56.95, time: "2023-12-14" },
  { close: 55.95, high: 57.31, low: 55.53, open: 57.06, time: "2023-12-17" },
  { close: 55.65, high: 56.69, low: 55.31, open: 55.94, time: "2023-12-18" },
  { close: 55.86, high: 56.92, low: 55.5, open: 55.72, time: "2023-12-19" },
  { close: 55.07, high: 56.01, low: 54.26, open: 55.92, time: "2023-12-20" },
  { close: 54.92, high: 56.53, low: 54.24, open: 54.84, time: "2023-12-21" },
  { close: 53.05, high: 55.04, low: 52.94, open: 54.68, time: "2023-12-24" },
  { close: 54.44, high: 54.47, low: 52.4, open: 53.23, time: "2023-12-26" },
  { close: 55.15, high: 55.17, low: 53.35, open: 54.31, time: "2023-12-27" },
  { close: 55.27, high: 55.86, low: 54.9, open: 55.37, time: "2023-12-28" },
  { close: 56.22, high: 56.23, low: 55.07, open: 55.53, time: "2023-12-31" },
  { close: 56.02, high: 56.16, low: 55.28, open: 56.16, time: "2024-01-02" },
  { close: 56.22, high: 56.99, low: 56.06, open: 56.3, time: "2024-01-03" },
  { close: 56.36, high: 56.89, low: 55.95, open: 56.49, time: "2024-01-04" },
  { close: 56.72, high: 57.26, low: 56.55, open: 56.76, time: "2024-01-07" },
  { close: 58.38, high: 58.69, low: 57.05, open: 57.27, time: "2024-01-08" },
  { close: 57.05, high: 57.72, low: 56.85, open: 57.68, time: "2024-01-09" },
  { close: 57.6, high: 57.7, low: 56.87, open: 57.29, time: "2024-01-10" },
  { close: 58.02, high: 58.26, low: 57.42, open: 57.84, time: "2024-01-11" },
  { close: 58.03, high: 58.15, low: 57.67, open: 57.83, time: "2024-01-14" },
  { close: 58.1, high: 58.29, low: 57.58, open: 57.74, time: "2024-01-15" },
  { close: 57.08, high: 57.93, low: 57.0, open: 57.93, time: "2024-01-16" },
  { close: 56.83, high: 57.4, low: 56.21, open: 57.16, time: "2024-01-17" },
  { close: 57.09, high: 57.47, low: 56.84, open: 56.92, time: "2024-01-18" },
  { close: 56.99, high: 57.39, low: 56.4, open: 57.23, time: "2024-01-22" },
  { close: 57.76, high: 57.87, low: 56.93, open: 56.98, time: "2024-01-23" },
  { close: 57.07, high: 57.65, low: 56.5, open: 57.61, time: "2024-01-24" },
  { close: 56.4, high: 57.47, low: 56.23, open: 57.18, time: "2024-01-25" },
  { close: 55.07, high: 56.22, low: 54.8, open: 56.12, time: "2024-01-28" },
  { close: 53.28, high: 54.3, low: 52.97, open: 53.62, time: "2024-01-29" },
  { close: 54.0, high: 54.02, low: 52.28, open: 53.1, time: "2024-01-30" },
  { close: 55.06, high: 55.19, low: 53.53, open: 54.05, time: "2024-01-31" },
  { close: 54.55, high: 55.3, low: 54.47, open: 55.21, time: "2024-02-01" },
  { close: 54.04, high: 54.69, low: 53.67, open: 54.6, time: "2024-02-04" },
  { close: 54.14, high: 54.34, low: 53.61, open: 54.1, time: "2024-02-05" },
  { close: 53.79, high: 54.37, low: 53.68, open: 54.11, time: "2024-02-06" },
  { close: 53.57, high: 53.73, low: 53.02, open: 53.61, time: "2024-02-07" },
  { close: 53.95, high: 53.96, low: 53.3, open: 53.36, time: "2024-02-08" },
  { close: 54.05, high: 54.37, low: 53.86, open: 54.13, time: "2024-02-11" },
  { close: 54.42, high: 54.77, low: 54.19, open: 54.45, time: "2024-02-12" },
  { close: 54.48, high: 54.77, low: 54.28, open: 54.35, time: "2024-02-13" },
  { close: 54.03, high: 54.52, low: 53.95, open: 54.38, time: "2024-02-14" },
  { close: 55.16, high: 55.19, low: 54.32, open: 54.48, time: "2024-02-15" },
  { close: 55.44, high: 55.66, low: 54.82, open: 55.06, time: "2024-02-19" },
  { close: 55.76, high: 55.91, low: 55.24, open: 55.37, time: "2024-02-20" },
  { close: 56.15, high: 56.72, low: 55.46, open: 55.55, time: "2024-02-21" },
  { close: 56.92, high: 57.13, low: 56.4, open: 56.43, time: "2024-02-22" },
  { close: 56.78, high: 57.27, low: 56.55, open: 57.0, time: "2024-02-25" },
  { close: 56.64, high: 57.09, low: 56.46, open: 56.82, time: "2024-02-26" },
  { close: 56.72, high: 56.73, low: 56.35, open: 56.55, time: "2024-02-27" },
  { close: 56.92, high: 57.61, low: 56.72, open: 56.74, time: "2024-02-28" },
  { close: 56.96, high: 57.15, low: 56.35, open: 57.02, time: "2024-03-01" },
  { close: 56.24, high: 57.34, low: 55.66, open: 57.15, time: "2024-03-04" },
  { close: 56.08, high: 56.17, low: 55.51, open: 56.09, time: "2024-03-05" },
  { close: 55.68, high: 56.42, low: 55.45, open: 56.19, time: "2024-03-06" },
  { close: 56.3, high: 56.4, low: 55.72, open: 55.76, time: "2024-03-07" },
  { close: 56.53, high: 56.68, low: 56.0, open: 56.36, time: "2024-03-08" },
  { close: 57.58, high: 57.62, low: 56.75, open: 56.76, time: "2024-03-11" },
  { close: 57.43, high: 58.11, low: 57.36, open: 57.63, time: "2024-03-12" },
  { close: 57.66, high: 57.74, low: 57.34, open: 57.37, time: "2024-03-13" },
  { close: 57.95, high: 58.09, low: 57.51, open: 57.71, time: "2024-03-14" },
  { close: 58.39, high: 58.51, low: 57.93, open: 58.04, time: "2024-03-15" },
  { close: 58.07, high: 58.32, low: 57.56, open: 58.27, time: "2024-03-18" },
  { close: 57.5, high: 58.2, low: 57.31, open: 58.1, time: "2024-03-19" },
  { close: 57.67, high: 58.05, low: 57.11, open: 57.51, time: "2024-03-20" },
  { close: 58.29, high: 58.49, low: 57.57, open: 57.58, time: "2024-03-21" },
  { close: 59.76, high: 60.0, low: 58.13, open: 58.16, time: "2024-03-22" },
  { close: 60.08, high: 60.19, low: 59.53, open: 59.63, time: "2024-03-25" },
  { close: 60.63, high: 60.69, low: 60.17, open: 60.3, time: "2024-03-26" },
  { close: 60.88, high: 61.19, low: 60.48, open: 60.56, time: "2024-03-27" },
  { close: 59.08, high: 60.89, low: 58.44, open: 60.88, time: "2024-03-28" },
  { close: 59.13, high: 59.27, low: 58.32, open: 59.2, time: "2024-03-29" },
  { close: 59.09, high: 59.41, low: 58.79, open: 59.39, time: "2024-04-01" },
  { close: 58.53, high: 59.23, low: 58.34, open: 59.22, time: "2024-04-02" },
  { close: 58.87, high: 59.07, low: 58.41, open: 58.78, time: "2024-04-03" },
  { close: 58.99, high: 59.1, low: 58.77, open: 58.84, time: "2024-04-04" },
  { close: 59.09, high: 59.09, low: 58.82, open: 59.02, time: "2024-04-05" },
  { close: 59.13, high: 59.13, low: 58.72, open: 59.02, time: "2024-04-08" },
  { close: 58.4, high: 58.56, low: 58.04, open: 58.37, time: "2024-04-09" },
  { close: 58.61, high: 58.7, low: 58.36, open: 58.4, time: "2024-04-10" },
  { close: 58.56, high: 58.73, low: 58.2, open: 58.65, time: "2024-04-11" },
  { close: 58.74, high: 58.79, low: 58.52, open: 58.75, time: "2024-04-12" },
  { close: 58.71, high: 58.95, low: 58.59, open: 58.91, time: "2024-04-15" },
  { close: 58.79, high: 58.98, low: 58.66, open: 58.79, time: "2024-04-16" },
  { close: 57.78, high: 58.46, low: 57.64, open: 58.4, time: "2024-04-17" },
  { close: 58.04, high: 58.2, low: 57.28, open: 57.51, time: "2024-04-18" },
  { close: 58.37, high: 58.49, low: 57.89, open: 58.14, time: "2024-04-22" },
  { close: 57.15, high: 57.72, low: 56.3, open: 57.62, time: "2024-04-23" },
  { close: 57.08, high: 57.57, low: 56.73, open: 57.34, time: "2024-04-24" },
  { close: 55.85, high: 56.9, low: 55.75, open: 56.82, time: "2024-04-25" },
  { close: 56.58, high: 56.81, low: 55.83, open: 56.06, time: "2024-04-26" },
  { close: 56.84, high: 57.17, low: 56.71, open: 56.75, time: "2024-04-29" },
  { close: 57.19, high: 57.45, low: 56.76, open: 56.99, time: "2024-04-30" },
  { close: 56.52, high: 57.3, low: 56.52, open: 57.23, time: "2024-05-01" },
  { close: 56.99, high: 58.23, low: 56.68, open: 56.81, time: "2024-05-02" },
  { close: 57.24, high: 57.36, low: 56.87, open: 57.15, time: "2024-05-03" },
  { close: 56.91, high: 57.09, low: 56.74, open: 56.83, time: "2024-05-06" },
  { close: 56.63, high: 56.81, low: 56.33, open: 56.69, time: "2024-05-07" },
  { close: 56.38, high: 56.7, low: 56.25, open: 56.66, time: "2024-05-08" },
  { close: 56.48, high: 56.56, low: 55.93, open: 56.12, time: "2024-05-09" },
  { close: 56.91, high: 57.04, low: 56.26, open: 56.49, time: "2024-05-10" },
];

const backgroundColor = "transparent";
const upColor = "#40B68B";
const downColor = "#FF5354";
const textColor = "#bcbcbd";
const gridLinesColor = "#222222";

export default function TokenChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current === null || chartContainerRef.current === null) {
      return;
    }

    const chart = createChart(chartRef.current, {
      crosshair: { mode: CrosshairMode.Normal },
      grid: {
        horzLines: { color: gridLinesColor },
        vertLines: { color: gridLinesColor },
      },
      layout: {
        background: {
          color: backgroundColor,
          type: ColorType.Solid,
        },
        fontFamily: robotoMono.style.fontFamily,
        textColor,
      },
    });
    chart.timeScale().fitContent();

    // Make Chart Responsive with screen resize
    const chartResizeObserver = new ResizeObserver((entries) => {
      if (
        entries.length === 0 ||
        entries[0].target !== chartContainerRef.current
      ) {
        return;
      }
      const newRect = entries[0].contentRect;
      chart.applyOptions({ height: newRect.height, width: newRect.width });
    });
    chartResizeObserver.observe(chartContainerRef.current);

    const newSeries = chart.addCandlestickSeries({
      baseLineVisible: false,
      borderVisible: false,
      downColor,
      upColor,
      wickDownColor: downColor,
      wickUpColor: upColor,
    });
    newSeries.setData(data);

    return () => {
      chart.remove();
      chartResizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="relative flex h-72 w-full flex-col border-b border-[#2A2E37] lg:h-auto lg:flex-1"
      ref={chartContainerRef}
    >
      <div className="absolute inset-0" ref={chartRef} />
    </div>
  );
}
