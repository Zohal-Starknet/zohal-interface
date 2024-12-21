"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { PriceServiceConnection } from "@pythnetwork/price-service-client";

export type PriceData = {
  pragmaPrice: number;
  currentPrice: number;
  change24h: number;
  change24hPercent: number;
  high24h: number;
  low24h: number;
};

type PriceContextType = {
  prices: Record<string, PriceData>;
};

const PriceContext = createContext<PriceContextType | undefined>(undefined);

const PAIR_SYMBOL_TO_PRICE_ID: Record<string, string> = {
  "ETH/USD": "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  "BTC/USD": "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  "STRK/USD": "0x6a182399ff70ccf3e06024898942028204125a819e519a335ffa4579e66cd870",
};

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<Record<string, PriceData>>({
    "ETH/USD": { pragmaPrice: 0, currentPrice: 0, change24h: 0, change24hPercent: 0, high24h: 0, low24h: 0 },
    "BTC/USD": { pragmaPrice: 0, currentPrice: 0, change24h: 0, change24hPercent: 0, high24h: 0, low24h: 0 },
    "STRK/USD": { pragmaPrice: 0, currentPrice: 0, change24h: 0, change24hPercent: 0, high24h: 0, low24h: 0 },
  });

  useEffect(() => {
    const connection = new PriceServiceConnection("https://hermes.pyth.network");

    Object.entries(PAIR_SYMBOL_TO_PRICE_ID).forEach(([pairSymbol, priceId]) => {
      connection.subscribePriceFeedUpdates([priceId], (priceFeed) => {
        const priceNoOlderThan = priceFeed.getPriceNoOlderThan(60);

        if (!priceNoOlderThan) return;

        const price = Number(priceNoOlderThan.price) / 10 ** (priceNoOlderThan.expo * -1);

        setPrices((prev) => ({
          ...prev,
          [pairSymbol]: { ...prev[pairSymbol], currentPrice: price },
        }));

      });
    });

    return () => {
      connection.closeWebSocket();
    };
  }, []);

  return <PriceContext.Provider value={{ prices }}>{children}</PriceContext.Provider>;
}

export function usePrices() {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error("usePrices must be used within a PriceProvider");
  }
  return context;
}
