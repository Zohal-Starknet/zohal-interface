"use client";

import { useEffect, useState } from "react";
import { Tokens } from "@zohal/app/_helpers/tokens";

/* eslint-disable @next/next/no-img-element */
export default function ChartHeader() {
  const [ethData, setEthData] = useState({
    currentPrice: 0,
    change24h: 0,
    change24hPercent: 0,
    high24h: 0,
    low24h: 0,
  });

  const pair = "eth/usd";
  const apiUrl = `/api/fetch-candlestick?pair=${pair}`;

  const convertToUnixTimestamp = (dateString: string): number => {
    return Math.floor(new Date(dateString).getTime() / 1000);
  };

  const filterLast24Hours = (data: any[]) => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const twentyFourHoursAgo = now - 24 * 60 * 60; // 24 hours ago in seconds
    return data.filter((d) => d.time >= twentyFourHoursAgo);
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

        const last24HoursData = filterLast24Hours(formattedData);

        if (last24HoursData.length < 2) {
          console.error("Not enough data for 24-hour calculations.");
          return;
        }

        last24HoursData.sort((a, b) => a.time - b.time);

        const latestData = last24HoursData[last24HoursData.length - 1];
        const previousData = last24HoursData[last24HoursData.length - 2];
        const high24h = Math.max(...last24HoursData.map((d: any) => d.high));
        const low24h = Math.min(...last24HoursData.map((d: any) => d.low));
        const change24h = latestData.close - previousData.close;
        const change24hPercent = (change24h / previousData.close) * 100;

        setEthData({
          currentPrice: latestData.close,
          change24h,
          change24hPercent,
          high24h,
          low24h,
        });
      }
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex h-[4.75rem] items-center pl-4">
      {/* Mobile View */}
      <div className="block lg:hidden border-border flex h-full items-center gap-4 border-r pr-10">
        <img
          alt={`${Tokens.ETH.name} icon`}
          className="w-8"
          src={Tokens.ETH.icon}
        />
        <span className="whitespace-nowrap">ETH-USD</span>
      </div>
      <div className="block lg:hidden flex h-full flex-1 items-center gap-8 overflow-auto">
        <div className="flex items-center gap-4 pl-5">
          <div className="flex flex-col">
            <span className="text-foreground">
              ${ethData.currentPrice.toFixed(2)}
            </span>
            <span className="text-muted-foreground text-sm">
              ${ethData.currentPrice.toFixed(2)}
            </span>
          </div>
          <span
            className={`text-xxs rounded-md px-2 py-1 text-sm font-semibold ${
              ethData.change24h >= 0
                ? "text-background bg-[#40B68B]"
                : "text-foreground bg-[#FF0000]"
            }`}
          >
            {ethData.change24hPercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Default View for larger screens */}
      <div className="hidden lg:flex h-full flex-1 items-center gap-8 overflow-auto">
        <div className="border-border flex h-full items-center gap-4 border-r pr-10">
          <img
            alt={`${Tokens.ETH.name} icon`}
            className="w-8"
            src={Tokens.ETH.icon}
          />
          <span className="whitespace-nowrap">ETH-USD</span>
        </div>
        <div className="flex items-center gap-4 pl-5">
          <div className="flex flex-col">
            <span className="text-foreground">
              ${ethData.currentPrice.toFixed(2)}
            </span>
            <span className="text-muted-foreground text-sm">
              ${ethData.currentPrice.toFixed(2)}
            </span>
          </div>
          <span
            className={`text-xxs rounded-md px-2 py-1 text-sm font-semibold ${
              ethData.change24h >= 0
                ? "text-background bg-[#40B68B]"
                : "text-foreground bg-[#FF0000]"
            }`}
          >
            {ethData.change24hPercent.toFixed(2)}%
          </span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">24h Change</span>
          <span
            className={`${
              ethData.change24h >= 0 ? "text-[#40B68B]" : "text-[#FF0000]"
            }`}
          >
            ${ethData.change24h.toFixed(2)} (
            {ethData.change24hPercent.toFixed(2)}%)
          </span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">24h High</span>
          <span className="text-foreground">${ethData.high24h.toFixed(2)}</span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1 pr-4">
          <span className="text-muted-foreground text-xs">24h Low</span>
          <span className="text-foreground">${ethData.low24h.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function VerticalDivider() {
  return <div className="bg-border h-6 w-[1px]" />;
}
