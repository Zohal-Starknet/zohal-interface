import { makeApiRequest } from './helpers';

interface DatafeedConfiguration {
    supported_resolutions: string[];
    exchanges: Array<{ value: string, name: string, desc: string }>;
    symbols_types: Array<{ name: string, value: string }>;
}

const configurationData: DatafeedConfiguration = {
    supported_resolutions: ['15M', '1D', '1W', '1M'],
    exchanges: [
        { value: 'Pragma', name: 'Pragma', desc: 'Pragma' },
    ],
    symbols_types: [
        { name: 'crypto', value: 'crypto' }
    ]
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
    const data = await makeApiRequest('data/v3/all/exchanges');
    let allSymbols: any[] = [{exchange: "Pragma",ticker:"ETH/USD"}];
    return allSymbols;
}

const datafeed = {
    onReady: (callback: (config: DatafeedConfiguration) => void) => {
        setTimeout(() => callback(configurationData));
    },
    searchSymbols: async (
        userInput: string,
        exchange: string,
        symbolType: string,
        onResultReadyCallback: (symbols: any[]) => void
    ) => {
        const symbols = await getAllSymbols();
        const newSymbols = symbols.filter(symbol => {
            const isExchangeValid = exchange === '' || symbol.exchange === exchange;
            const isFullSymbolContainsInput = symbol.ticker
                .toLowerCase()
                .indexOf(userInput.toLowerCase()) !== -1;
            return isExchangeValid && isFullSymbolContainsInput;
        });
        onResultReadyCallback(newSymbols);
    },
    resolveSymbol: async (
        symbolName: string,
        onSymbolResolvedCallback: (symbolInfo: LibrarySymbolInfo) => void,
        onResolveErrorCallback: (reason: string) => void
    ) => {
        const symbols = await getAllSymbols();
        const symbolItem = symbols.find(({ ticker }) => ticker === symbolName);
        if (!symbolItem) {
            console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
            onResolveErrorCallback('Cannot resolve symbol');
            return;
        }
        const symbolInfo: LibrarySymbolInfo = {
            ticker: symbolItem.ticker,
            name: symbolItem.symbol,
            description: symbolItem.description,
            type: symbolItem.type,
            session: '24x7',
            timezone: 'Etc/UTC',
            exchange: symbolItem.exchange,
            minmov: 1,
            pricescale: 100,
            has_intraday: false,
            visible_plots_set: 'ohlc',
            has_weekly_and_monthly: false,
            supported_resolutions: configurationData.supported_resolutions,
            volume_precision: 2,
            data_status: 'streaming',
        };
        onSymbolResolvedCallback(symbolInfo);
    },
    getBars: async (
        symbolInfo: LibrarySymbolInfo,
        resolution: string,
        periodParams: { from: number, to: number, firstDataRequest: boolean },
        onHistoryCallback: (bars: any[], meta: { noData: boolean }) => void,
        onErrorCallback: (error: Error) => void
    ) => {
        const { from, to } = periodParams;
        try {
            const pair = "eth/usd";
            const apiUrl = `/api/fetch-candlestick?pair=${pair}`;
            const data = await makeApiRequest(apiUrl);
            if (data.Response && data.Response === 'Error' || data.data.length === 0) {
                onHistoryCallback([], { noData: true });
                return;
            }
            //@ts-ignore
            let bars = [];
            let time ;
            data.data.forEach((bar: any) => {
                time = new Date(bar.time).getTime();
                //@ts-ignore
                bars = [...bars, {
                    time: time ,
                    low: bar.low / 10 **8,
                    high: bar.high / 10 **8,
                    open: bar.open / 10 **8,
                    close: bar.close / 10 **8,
                }];
            });
            //@ts-ignore
            onHistoryCallback(bars, { noData: false });
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
        onResetCacheNeededCallback: () => void
    ) => {
        console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
    },
    unsubscribeBars: (subscriberUID: string) => {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    },
};

export default datafeed;