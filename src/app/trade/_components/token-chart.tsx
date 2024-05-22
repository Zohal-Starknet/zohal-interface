"use client";

import { robotoMono } from "@zohal/app/_helpers/fonts";
// TODO @YohanTz: Add NOTICE file mentioning Trading view for using their chart library
import { ColorType, CrosshairMode, createChart } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";

/**
 * TODO @YohanTz: Handle different time zones
 * https://tradingview.github.io/lightweight-charts/docs/time-zones
 */


const backgroundColor = "transparent";
const upColor = "#40B68B";
const downColor = "#FF5354";
const textColor = "#bcbcbd";
const gridLinesColor = "#222222";

export default function TokenChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState([]);

  const pair = "eth/usd";
  const apiUrl = `/api/fetch-candlestick?pair=${pair}`;
  console.log(`Fetching data from ${apiUrl}`);
  
  const convertToUnixTimestamp = (dateString) => {
    return Math.floor(new Date(dateString).getTime() / 1000); // Convert to Unix timestamp
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const responseData = await response.json();
         
          const formattedData = responseData.data.map(d => ({
            time: convertToUnixTimestamp(d.time),
            open: Number(d.open) / 100000000,
            high: Number(d.high) / 100000000,
            low: Number(d.low) / 100000000,
            close: Number(d.close) / 100000000,
          }));

          // Ensure the data is sorted by time in ascending order
          const uniqueData = Array.from(new Map(formattedData.map(item => [item.time, item])).values()).sort((a, b) => a.time - b.time);

          setData(uniqueData);
        } else {
          // Handle errors from the external API
          console.log("ELSE")
        }
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    fetchData();

    if (!chartContainerRef.current) return;

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

    const chartResizeObserver = new ResizeObserver(entries => {
      if (!entries.length || entries[0].target !== chartContainerRef.current) return;
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
  }, [data]);

  return (
    <div
      className="relative flex h-72 w-full flex-col border-b border-[#2A2E37] lg:h-auto lg:flex-1"
      ref={chartContainerRef}
    >
      <div className="absolute inset-0" ref={chartRef} />
    </div>
  );
}
