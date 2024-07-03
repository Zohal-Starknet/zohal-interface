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

        const latestData = formattedData[formattedData.length - 1];
        const previousData = formattedData[formattedData.length - 2];
        const high24h = Math.max(...formattedData.map((d: any) => d.high));
        const low24h = Math.min(...formattedData.map((d: any) => d.low));
        const change24h = latestData.close - previousData.close;
        const change24hPercent = (change24h / previousData.close) * 100;

        setEthData({
          currentPrice: latestData.close,
          change24h,
          change24hPercent,
          high24h,
          low24h,
        });
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
    <div className="flex h-[4.75rem] items-center pl-4">
      <div className="flex h-full items-center gap-4 border-r border-[#2A2E37] pr-10">
        <img
          alt={`${Tokens.ETH.name} icon`}
          className="w-8"
          src={Tokens.ETH.icon}
        />
        <span className="whitespace-nowrap">ETH-USD</span>
      </div>
      <div className="flex h-full flex-1 items-center gap-8 overflow-auto">
        <div className="flex items-center gap-4 pl-5">
          <div className="flex flex-col">
            <span className="text-white">${ethData.currentPrice.toFixed(2)}</span>
            <span className="text-sm text-[#A5A5A7]">${ethData.currentPrice.toFixed(2)}</span>
          </div>
          <span className={`text-xxs rounded-md px-2 py-1 text-sm font-semibold ${ethData.change24h >= 0 ? 'bg-[#40B68B] text-black' : 'bg-[#FF0000] text-white'}`}>
            {ethData.change24hPercent.toFixed(2)}%
          </span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#A5A5A7]">24h Change</span>
          <span className={`${ethData.change24h >= 0 ? 'text-[#40B68B]' : 'text-[#FF0000]'}`}>
            ${ethData.change24h.toFixed(2)} ({ethData.change24hPercent.toFixed(2)}%)
          </span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#A5A5A7]">24h High</span>
          <span className="text-white">${ethData.high24h.toFixed(2)}</span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1 pr-4">
          <span className="text-xs text-[#A5A5A7]">24h Low</span>
          <span className="text-white">${ethData.low24h.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function VerticalDivider() {
  return <div className="h-6 w-[1px] bg-[#2A2E37]" />;
}
