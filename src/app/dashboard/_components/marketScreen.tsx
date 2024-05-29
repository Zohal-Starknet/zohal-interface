// File: /src/MarketScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import './marketScreen.css';

interface Token {
    name: string;
    symbol: string;
    currentPrice: number;
    priceChange1h: number;
    priceChange24h: number;
    priceChange7d: number;
    volume24h: number;
    marketCap: number;
}

const API_URL = 'https://starknet.impulse.avnu.fi/v1/tokens/';

const tokenAddresses = [
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8'
];

const fetchTokenData = async (address: string): Promise<Token | null> => {
    try {
        const response = await fetch(API_URL + address);
        if (!response.ok) {
            throw new Error('Failed to fetch AVNU data');
        }
        const data = await response.json();
        return {
            name: data.name,
            symbol: data.symbol,
            currentPrice: parseFloat(data.market.currentPrice.toFixed(2)),
            priceChange1h: parseFloat(data.market.priceChangePercentage1h.toFixed(2)),
            priceChange24h: parseFloat(data.market.priceChangePercentage24h.toFixed(2)),
            priceChange7d: parseFloat(data.market.priceChangePercentage7d.toFixed(2)),
            volume24h: parseFloat(data.market.starknetVolume24h.toFixed(2)),
            marketCap: parseFloat(data.market.marketCap.toFixed(2)),
        };
    } catch (error) {
        console.error('Error fetching data from AVNU:', error);
        return null;
    }
};

const MarketScreen: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [tokensData, setTokensData] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDataForAllTokens = useCallback(async () => {
        const promises = tokenAddresses.map(fetchTokenData);
        const results = await Promise.all(promises);
        const validResults = results.filter((result): result is Token => result !== null);
        setTokensData(validResults);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchDataForAllTokens();
    }, [fetchDataForAllTokens]);

    const filteredTokens = tokensData.filter(token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <div className="header">
                <h1 className="title">Zohal Market</h1>
            </div>
            <input
                className="search-bar"
                placeholder="Token name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="market-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Price (USD)</th>
                            <th>Change 1h (%)</th>
                            <th>Change 24h (%)</th>
                            <th>Change 7 Days (%)</th>
                            <th>Volume 24h</th>
                            <th>Market Cap</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTokens.map((token, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{token.name}</td>
                                <td>{token.symbol}</td>
                                <td>${token.currentPrice.toLocaleString()}</td>
                                <td className={token.priceChange1h >= 0 ? 'positive' : 'negative'}>
                                    {token.priceChange1h >= 0 ? <>&#9650; {token.priceChange1h.toLocaleString()}%</> : <>&#9660; {Math.abs(token.priceChange1h).toLocaleString()}%</>}
                                </td>
                                <td className={token.priceChange24h >= 0 ? 'positive' : 'negative'}>
                                    {token.priceChange24h >= 0 ? <>&#9650; {token.priceChange24h.toLocaleString()}%</> : <>&#9660; {Math.abs(token.priceChange24h).toLocaleString()}%</>}
                                </td>
                                <td className={token.priceChange7d >= 0 ? 'positive' : 'negative'}>
                                    {token.priceChange7d >= 0 ? <>&#9650; {token.priceChange7d.toLocaleString()}%</> : <>&#9660; {Math.abs(token.priceChange7d).toLocaleString()}%</>}
                                </td>
                                <td>${token.volume24h.toLocaleString()}</td>
                                <td>${token.marketCap.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MarketScreen;
