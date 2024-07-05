import { makeApiRequest, generateSymbol, parseFullSymbol } from './helpers';

interface DatafeedConfiguration {
    supported_resolutions: string[];
    exchanges: Array<{ value: string, name: string, desc: string }>;
    symbols_types: Array<{ name: string, value: string }>;
}

const configurationData: DatafeedConfiguration = {
    supported_resolutions: ['1D', '1W', '1M'],
    exchanges: [
        { value: 'Bitfinex', name: 'Bitfinex', desc: 'Bitfinex' },
        { value: 'Kraken', name: 'Kraken', desc: 'Kraken bitcoin exchange' },
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
    let allSymbols: any[] = [];

    for (const exchange of configurationData.exchanges) {
        const pairs = data.Data[exchange.value].pairs;

        for (const leftPairPart of Object.keys(pairs)) {
            const symbols = pairs[leftPairPart].map((rightPairPart: string) => {
                const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart);
                return {
                    symbol: symbol.short,
                    ticker: symbol.full,
                    description: symbol.short,
                    exchange: exchange.value,
                    type: 'crypto',
                };
            });
            allSymbols = [...allSymbols, ...symbols];
        }
    }
    return allSymbols;
}

const datafeed = {
    onReady: (callback: (config: DatafeedConfiguration) => void) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData));
    },
    searchSymbols: async (
        userInput: string,
        exchange: string,
        symbolType: string,
        onResultReadyCallback: (symbols: any[]) => void
    ) => {
        console.log('[searchSymbols]: Method call');
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
        console.log('[resolveSymbol]: Method call', symbolName);
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
        console.log('[resolveSymbol]: Symbol resolved', symbolName);
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
        console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
        const parsedSymbol = parseFullSymbol(symbolInfo.ticker);
        if (!parsedSymbol) {
            onErrorCallback(new Error('Invalid symbol'));
            return;
        }
        const urlParameters = {
            fsym: parsedSymbol.fromSymbol,
            tsym: parsedSymbol.toSymbol,
            toTs: to,
            limit: 2000,
        };
        const query = Object.keys(urlParameters)
            .map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
            .join('&');
        try {
            const data = await makeApiRequest(`data/histoday?${query}`);
            if (data.Response && data.Response === 'Error' || data.Data.length === 0) {
                onHistoryCallback([], { noData: true });
                return;
            }
            let bars = [];
            data.Data.forEach((bar: any) => {
                if (bar.time >= from && bar.time < to) {
                    bars = [...bars, {
                        time: bar.time * 1000,
                        low: bar.low,
                        high: bar.high,
                        open: bar.open,
                        close: bar.close,
                    }];
                }
            });
            console.log(`[getBars]: returned ${bars.length} bar(s)`);
            onHistoryCallback(bars, { noData: false });
        } catch (error) {
            console.log('[getBars]: Get error', error);
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
