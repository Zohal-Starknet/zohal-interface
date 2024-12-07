import { useState, useEffect } from "react";

type PriceData = {
  pragmaPrice: number;
  currentPrice: number;
  change24h: number;
  change24hPercent: number;
  high24h: number;
  low24h: number;
};

const pair = "btc/usd";
const apiUrl = `/api/fetch-candlestick?pair=${pair}`;

const convertToUnixTimestamp = (dateString: string): number => {
  return Math.floor(new Date(dateString).getTime() / 1000);
};

const getLastTwoDaysData = (data: any[]): any[] => {
  const now = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
  const twoDaysAgo = now - (2 * 24 * 60 * 60); // Unix timestamp for 2 days ago

  return data.filter(item => item.time >= twoDaysAgo);
};

export default function useBtcPrice() {
  const [btcData, setBtcData] = useState<PriceData>({
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

        setBtcData({
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
    const interval = setInterval(fetchData, 60000); // Fetch data every 60 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return { btcData, loading, error };
}
