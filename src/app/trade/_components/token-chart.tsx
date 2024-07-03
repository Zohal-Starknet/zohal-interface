"use client";

import React, { useEffect, useState } from "react";
import { Chart, Series } from "./chart";
import { ColorType, CrosshairMode } from "lightweight-charts";
import { robotoMono } from "@zohal/app/_helpers/fonts";

const backgroundColor = "transparent";
const upColor = "#40B68B";
const downColor = "#FF5354";
const textColor = "#bcbcbd";
const gridLinesColor = "#222222";

export default function TokenChart() {
  const [data, setData] = useState<any[]>([]);
  const pair = "eth/usd";
  const apiUrl = `/api/fetch-candlestick?pair=${pair}`;

  const convertToUnixTimestamp = (dateString: string): number => {
    return Math.floor(new Date(dateString).getTime() / 1000);
  };

  const getLastTwoDaysData = (data: any[]) => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoTimestamp = twoDaysAgo.getTime() / 1000;
    return data.filter(d => d.time >= twoDaysAgoTimestamp);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const responseData = await response.json();

        const formattedData = responseData.data.map((d: any) => ({
          time: convertToUnixTimestamp(d.time),
          open: Number(d.open) / 100000000,
          high: Number(d.high) / 100000000,
          low: Number(d.low) / 100000000,
          close: Number(d.close) / 100000000,
        }));
         //@ts-ignore
        const uniqueData = Array.from(new Map(formattedData.map(item => [item.time, item])).values()).sort((a, b) => a.time - b.time);

        const filteredData = getLastTwoDaysData(uniqueData);

        setData(filteredData);
      } else {
        console.log("ELSE");
      }
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 3000); // Fetch new data every 3 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative flex h-100 w-full flex-col border-b border-[#2A2E37] lg:h-auto lg:flex-1">
      <Chart
       //@ts-ignore
        layout={{ background: { color: backgroundColor, type: ColorType.Solid }, fontFamily: robotoMono.style.fontFamily, textColor }}
        grid={{ horzLines: { color: gridLinesColor }, vertLines: { color: gridLinesColor } }}
        crosshair={{ mode: CrosshairMode.Normal }}
      >
        <Series
          type="candlestick"
          data={data}
          upColor={upColor}
          downColor={downColor}
          wickUpColor={upColor}
          wickDownColor={downColor}
        />
      </Chart>
    </div>
  );
}
