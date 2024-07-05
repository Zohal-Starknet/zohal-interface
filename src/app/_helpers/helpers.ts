export async function makeApiRequest(path: string) {
    try {
        const response = await fetch(`https://your-api-endpoint.com/${path}`);
        return response.json();
    } catch (error: any) {
        throw new Error(`API request error: ${error.status}`);
    }
}

export function generateSymbol(exchange: string, fromSymbol: string, toSymbol: string) {
    const short = `${fromSymbol}/${toSymbol}`;
    return {
        short,
        full: `${exchange}:${short}`,
    };
}

export function parseFullSymbol(fullSymbol: string) {
    const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
    if (!match) {
        return null;
    }
    return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
}
