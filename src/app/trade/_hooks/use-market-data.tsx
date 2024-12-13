import { useEffect, useState } from "react";
import { subscribeOnStream, unsubscribeFromStream } from "../../_helpers/streaming";

export type PriceData = {
  currentPrice: number;
  high24h: number;
  low24h: number;
  change24h: number;
  change24hPercent: number;
};

const API_ENDPOINT = 'https://benchmarks.pyth.network/v1/shims/tradingview';

export function usePythPriceSubscription(pairSymbol: string) {
  const [priceData, setPriceData] = useState<PriceData>({
    currentPrice: 0,
    high24h: 0,
    low24h: 0,
    change24h: 0,
    change24hPercent: 0,
  });

  useEffect(() => {
    const subscriberUID = `${pairSymbol}-subscriber`;

    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}`);
        const data = await response.json();
        console.log("DATAA", data)
        if (data && data.close) {
          setPriceData({
            currentPrice: data.close,
            high24h: data.high || 0,
            low24h: data.low || 0,
            change24h: 0,
            change24hPercent: 0
          });
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();

    const onRealtimeCallback = (bar: any) => {
      setPriceData((prevData) => ({
        currentPrice: bar.close,
        high24h: Math.max(prevData.high24h, bar.high),
        low24h: prevData.low24h === 0 ? bar.low : Math.min(prevData.low24h, bar.low),
        change24h: bar.close - (prevData.currentPrice || bar.close),
        change24hPercent:
          ((bar.close - (prevData.currentPrice || bar.close)) / (prevData.currentPrice || bar.close)) * 100,
      }));
    };

    const onResetCacheNeededCallback = () => {
      console.log("Cache reset needed for", pairSymbol);
    };

    // Subscribe to Pyth stream
    subscribeOnStream(
      { ticker: pairSymbol }, // Assuming pairSymbol matches the Pyth ticker format
      "15min",
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      null // No last bar cached initially
    );

    return () => {
      unsubscribeFromStream(subscriberUID);
    };
  }, [pairSymbol]);

  return {
    priceData,
  };
}


export default function useEthPrice() {
  const [ethData, setEthData] = useState<PriceData>({
    pragmaPrice: 0,
    currentPrice: 0,
    change24h: 0,
    change24hPercent: 0,
    high24h: 0,
    low24h: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const convertToUnixTimestamp = (dateString: string): number => {
    return Math.floor(new Date(dateString).getTime() / 1000);
  };

  const filterLast24Hours = (data: any[]) => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const twentyFourHoursAgo = now - 24 * 60 * 60; // 24 hours ago in seconds
    return data.filter((d) => d.time >= twentyFourHoursAgo);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
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
          pragmaPrice: latestData.close * 100000000,
          currentPrice: latestData.close,
          change24h,
          change24hPercent,
          high24h,
          low24h,
        });
      } else {
        setError(new Error("Failed to fetch data"));
      }
    } catch (error) {
      console.error("Failed to fetch data: ", error);
      //@ts-ignore
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000); // Fetch data every 60 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return { ethData, loading, error };
}
