export async function makeApiRequest(path: string) {
    try {
        const pair = "eth/usd";
        const response = await fetch(`/api/fetch-candlestick?pair=${pair}`);
        return response.json();
    } catch (error: any) {
        throw new Error(`API request error: ${error.status}`);
    }
}