"use client";

import { useEffect, useState } from "react";
import { Tokens } from "@zohal/app/_helpers/tokens";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@zohal/app/_ui/dropdown-menu";
import { ChevronRight } from "@zohal/app/_ui/icons";
import useEthPrice, {
  usePriceDataSubscription,
} from "../_hooks/use-market-data";

interface ChartHeaderProps {
  onSymbolChange: (newSymbol: string) => void;
  initialSymbol: string;
}

export default function ChartHeader(props: ChartHeaderProps) {
  const { onSymbolChange, initialSymbol } = props;
  const [symbol, setSymbol] = useState(initialSymbol);
  const [tokenImg, setTokenImg] = useState("ETH");
  const pair = symbol.toLowerCase();

  const { tokenData: priceData } = usePriceDataSubscription({ pairSymbol: symbol });

  return (
    <div className="flex h-[3.8rem] items-center pl-4">
      {/* Mobile View */}
      <div className="block flex h-full items-center gap-4 border-r border-border pr-10 lg:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className="rounded-lg border border-border bg-secondary px-3 py-2">
              {symbol}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="space-y-1">
            <DropdownMenuItem>Close position</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="block flex h-full flex-1 items-center gap-8 overflow-auto lg:hidden">
        <div className="flex items-center gap-4 pl-5">
          <div className="flex flex-col">
            <span className="text-foreground">
              ${priceData.currentPrice.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">
              ${priceData.currentPrice.toFixed(2)}
            </span>
          </div>
          <span
            className={`text-xxs rounded-md px-2 py-1 text-sm font-semibold ${
              priceData.change24h >= 0
                ? "bg-[#40B68B] text-background"
                : "bg-[#FF0000] text-foreground"
            }`}
          >
            {priceData.change24hPercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Default View for larger screens */}
      <div className="hidden h-full flex-1 items-center gap-8 overflow-auto lg:flex">
        <div className="flex h-full items-center gap-4 border-r border-border pr-5">
          <img
            alt={`${Tokens[tokenImg].name} icon`}
            className="w-8"
            src={Tokens[tokenImg].icon}
          />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="flex transition-colors duration-200 hover:text-yellow-500">
                {symbol}
                <ChevronRight className="rotate-90" label="chevron" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="space-y-1">
              <DropdownMenuItem
                onClick={() => {
                  setSymbol("ETH/USD");
                  setTokenImg("ETH");
                  onSymbolChange("ETH/USD");
                }}
              >
                <img
                  alt={`${Tokens["ETH"].name} icon`}
                  className="w-8"
                  src={Tokens["ETH"].icon}
                />
                ETH/USD
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSymbol("BTC/USD");
                  setTokenImg("BTC");
                  onSymbolChange("BTC/USD");
                }}
              >
                <img
                  alt={`${Tokens["BTC"].name} icon`}
                  className="w-8"
                  src={Tokens["BTC"].icon}
                />
                BTC/USD
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSymbol("STRK/USD");
                  setTokenImg("STRK");
                  onSymbolChange("STRK/USD");
                }}
              >
                <img
                  alt={`${Tokens["STRK"].name} icon`}
                  className="w-8"
                  src={Tokens["STRK"].icon}
                />
                STRK/USD
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-4 pl-5">
          <div className="flex flex-col">
            <span className="text-foreground">
              ${priceData.currentPrice.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">
              ${priceData.currentPrice.toFixed(2)}
            </span>
          </div>
          <span
            className={`text-xxs rounded-md px-2 py-1 text-sm font-semibold ${
              priceData.change24h >= 0
                ? "bg-[#40B68B] text-background"
                : "bg-[#FF0000] text-foreground"
            }`}
          >
            {priceData.change24hPercent.toFixed(2)}%
          </span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">24h Change</span>
          <span
            className={`${
              priceData.change24h >= 0 ? "text-[#40B68B]" : "text-[#FF0000]"
            }`}
          >
            ${priceData.change24h.toFixed(2)} (
            {priceData.change24hPercent.toFixed(2)}%)
          </span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">24h High</span>
          <span className="text-foreground">
            ${priceData.high24h.toFixed(2)}
          </span>
        </div>
        <VerticalDivider />
        <div className="flex flex-col gap-1 pr-4">
          <span className="text-xs text-muted-foreground">24h Low</span>
          <span className="text-foreground">
            ${priceData.low24h.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

function VerticalDivider() {
  return <div className="h-6 w-[1px] bg-border" />;
}
