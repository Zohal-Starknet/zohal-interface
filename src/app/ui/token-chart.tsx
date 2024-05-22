"use client";

import { robotoMono } from "@satoru/utils/fonts";
// TODO @YohanTz: Add NOTICE file mentioning Trading view for using their chart library
import { createChart, ColorType, CrosshairMode } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";


const backgroundColor = "transparent";
const upColor = "#00ff4d";
const downColor = "#ff0000";
const textColor = "white";
const gridLinesColor = "#333333";

export default function TokenChart() {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://api.dev.pragma.build/node/v1/aggregation/candlestick/eth/usd?interval=15min", {
        headers: {
          'x-api-key': 'atrkbD57o64tXQPbBnAjxa1BWV5sk0W85npAIxq8'
        }
      });
      const json = await response.json();
      setData(json.map(d => ({
        time: d.time,
        open: d.open + 3000,
        high: d.high + 3000,
        low: d.low + 3000,
        close: d.close + 3000,
      })));
    };
    
    fetchData();

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
      upColor,
      downColor,
      wickUpColor: upColor,
      wickDownColor: downColor,
      borderVisible: false,
      baseLineVisible: false,
    });
    newSeries.setData(data);

    return () => {
      chart.remove();
      chartResizeObserver.disconnect();
    };
  }, []);

  return <div ref={chartContainerRef} className="h-full w-full" />;
}
