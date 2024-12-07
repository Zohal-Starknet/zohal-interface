import { makeApiRequest } from "./helpers";

interface DatafeedConfiguration {
  supported_resolutions: string[];
  exchanges: Array<{ value: string; name: string; desc: string }>;
  symbols_types: Array<{ name: string; value: string }>;
}

const configurationData: DatafeedConfiguration = {
  supported_resolutions: ["15"],
  exchanges: [{ value: "Pragma", name: "Pragma", desc: "Pragma" }],
  symbols_types: [{ name: "crypto", value: "crypto" }],
};

interface LibrarySymbolInfo {
  ticker: string;
  name: string;
  description: string;
  type: string;
  session: string;
  timezone: string;
  exchange: string;
  minmov: number;
  pricescale: number;
  has_intraday: boolean;
  visible_plots_set: string;
  has_weekly_and_monthly: boolean;
  supported_resolutions: string[];
  volume_precision: number;
  data_status: string;
}

async function getAllSymbols() {
  const data = await makeApiRequest("data/v3/all/exchanges");
  let allSymbols: any[] = [
    { exchange: "Pragma", ticker: "ETH/USD" },
    { exchange: "Pragma", ticker: "BTC/USD" },
    { exchange: "Pragma", ticker: "STRK/USD" },
  ];
  return allSymbols;
}

const datafeed = (pairSymbol: string) => ({
  onReady: (callback: (config: DatafeedConfiguration) => void) => {
    setTimeout(() => callback(configurationData));
  },
  searchSymbols: async (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: (symbols: any[]) => void,
  ) => {
    const symbols = await getAllSymbols();
    const newSymbols = symbols.filter((symbol) => {
      const isExchangeValid = exchange === "" || symbol.exchange === exchange;
      const isFullSymbolContainsInput =
        symbol.ticker.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
      return isExchangeValid && isFullSymbolContainsInput;
    });
    onResultReadyCallback(newSymbols);
  },
  resolveSymbol: async (
    symbolName: string,
    onSymbolResolvedCallback: (symbolInfo: LibrarySymbolInfo) => void,
    onResolveErrorCallback: (reason: string) => void,
  ) => {
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(({ ticker }) => ticker === symbolName);
    if (!symbolItem) {
      console.log("[resolveSymbol]: Cannot resolve symbol", symbolName);
      onResolveErrorCallback("Cannot resolve symbol");
      return;
    }
    const symbolInfo: LibrarySymbolInfo = {
      ticker: symbolItem.ticker,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: symbolItem.exchange,
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      visible_plots_set: "ohlc",
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: "streaming",
    };
    onSymbolResolvedCallback(symbolInfo);
  },
  getBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    periodParams: { from: number; to: number; firstDataRequest: boolean },
    onHistoryCallback: (bars: any[], meta: { noData: boolean }) => void,
    onErrorCallback: (error: Error) => void,
  ) => {
    const { from, to } = periodParams;
    try {
      const data = await makeApiRequest(pairSymbol);
      if (
        (data.Response && data.Response === "Error") ||
        data.data.length === 0
      ) {
        onHistoryCallback([], { noData: true });
        return;
      }
      //@ts-ignore
      let bars = [];
      let time;
      data.data.forEach((bar: any) => {
        time = new Date(bar.time).getTime();
        //@ts-ignore
        bars = [
          ...bars,
          {
            time: time,
            low: bar.low / 10 ** 8,
            high: bar.high / 10 ** 8,
            open: bar.open / 10 ** 8,
            close: bar.close / 10 ** 8,
          },
        ];
      });

      //@ts-ignore
      bars.sort((a, b) => a.time - b.time);

      //@ts-ignore
      onHistoryCallback(bars, { noData: bars.length === 0 });
    } catch (error) {
      //@ts-ignore
      onErrorCallback(error);
    }
  },
  subscribeBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    onRealtimeCallback: (bar: any) => void,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void,
  ) => {
    const ws = new WebSocket(
      "wss://ws.dev.pragma.build/node/v1/onchain/ohlc/subscribe",
    );
    ws.onopen = () => {
      const subscribeMessage = {
        msg_type: "subscribe",
        pair: pairSymbol,
        network: "mainnet",
        interval: "15min",
        candles_to_get: 1,
      };
      ws.send(JSON.stringify(subscribeMessage));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        data.forEach((barData) => {
          try {
            const time = new Date(barData.time).getTime();
            if (isNaN(time)) {
              throw new Error(`Invalid time value: ${barData.time}`);
            }
            const bar = {
              time: time,
              low: parseFloat(barData.low) / 10 ** 8,
              high: parseFloat(barData.high) / 10 ** 8,
              open: parseFloat(barData.open) / 10 ** 8,
              close: parseFloat(barData.close) / 10 ** 8,
            };
            onRealtimeCallback(bar);
          } catch (error) {
            console.error("[subscribeBars]: Error parsing bar data", error);
          }
        });
      }
    };

    ws.onclose = () => {
      console.log(
        "[subscribeBars]: WebSocket connection closed with subscriberUID:",
        subscriberUID,
      );
    };

    ws.onerror = (error) => {
      console.error("[subscribeBars]: WebSocket error", error);
    };

    (this as any)._ws = ws;
  },
  unsubscribeBars: (subscriberUID: string) => {
    const ws = (this as any)._ws;
    if (ws) {
      ws.close();
      delete (this as any)._ws;
    }
  },
});

export default datafeed;
