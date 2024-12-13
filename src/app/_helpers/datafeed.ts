import { makeApiRequest } from "./helpers";
import { subscribeOnStream, unsubscribeFromStream } from "./streaming";

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
const API_ENDPOINT = 'https://benchmarks.pyth.network/v1/shims/tradingview'
const lastBarsCache = new Map()

const datafeed = (pairSymbol: string) => ({
  onReady: (callback: (config: DatafeedConfiguration) => void) => {
    fetch(`${API_ENDPOINT}/config`).then((response) => {
      response.json().then((configurationData) => {
        setTimeout(() => callback(configurationData))
      })
    })
  },
  searchSymbols: async (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: (symbols: any[]) => void,
  ) => {
    // console.log('[searchSymbols]: Method call')
    fetch(`${API_ENDPOINT}/search?query=${userInput}`).then((response) => {
      response.json().then((data) => {
        onResultReadyCallback(data)
      })
    })
  },
  resolveSymbol: async (
    symbolName: string,
    onSymbolResolvedCallback: (symbolInfo: LibrarySymbolInfo) => void,
    onResolveErrorCallback: (reason: string) => void,
  ) => {
    // console.log('[resolveSymbol]: Method call', symbolName)
    fetch(`${API_ENDPOINT}/symbols?symbol=${symbolName}`).then((response) => {
      response
        .json()
        .then((symbolInfo) => {
          // console.log('[resolveSymbol]: Symbol resolved', symbolInfo)
          onSymbolResolvedCallback(symbolInfo)
        })
        .catch((error) => {
          // console.log('[resolveSymbol]: Cannot resolve symbol', symbolName)
          onResolveErrorCallback('Cannot resolve symbol')
          return
        })
    })
  },
  getBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    periodParams: { from: number; to: number; firstDataRequest: boolean },
    onHistoryCallback: (bars: any[], meta: { noData: boolean }) => void,
    onErrorCallback: (error: Error) => void,
  ) => {
    const { from, to, firstDataRequest } = periodParams
    // console.log('[getBars]: Method call', symbolInfo, resolution, from, to)

    const maxRangeInSeconds = 365 * 24 * 60 * 60 // 1 year in seconds

    let promises = []
    let currentFrom = from
    let currentTo

    while (currentFrom < to) {
      currentTo = Math.min(to, currentFrom + maxRangeInSeconds)
      const url = `${API_ENDPOINT}/history?symbol=${symbolInfo.ticker}&from=${currentFrom}&to=${currentTo}&resolution=${resolution}`
      promises.push(fetch(url).then((response) => response.json()))
      currentFrom = currentTo
    }

    Promise.all(promises)
      .then((results) => {
        const bars: any = []
        results.forEach((data) => {
          if (data.t.length > 0) {
            data.t.forEach((time, index) => {
              bars.push({
                time: time * 1000,
                low: data.l[index],
                high: data.h[index],
                open: data.o[index],
                close: data.c[index],
              })
            })
          }
        })

        if (firstDataRequest && bars.length > 0) {
          lastBarsCache.set(symbolInfo.ticker, {
            ...bars[bars.length - 1],
          })
        }

        onHistoryCallback(bars, { noData: bars.length === 0 })
      })
      .catch((error) => {
        // console.log('[getBars]: Get error', error)
        onErrorCallback(error)
      })
  },
  subscribeBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    onRealtimeCallback: (bar: any) => void,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void,
  ) => {
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.ticker)
    )
  },
  unsubscribeBars: (subscriberUID: string) => {
    unsubscribeFromStream(subscriberUID)
  },
});

export default datafeed;
