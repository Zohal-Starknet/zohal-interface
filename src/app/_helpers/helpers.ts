export async function makeApiRequest(path: string) {
  try {
    console.log("this is path", path);
    let pair = "eth/usd";
    if (path === "ETH/USD") {
      pair = "eth/usd";
    }
    if (path === "BTC/USD") {
      pair = "btc/usd";
    }
    if (path === "STRK/USD") {
      pair = "strk/usd";
    }
    const response = await fetch(`/api/fetch-candlestick?pair=${pair}`);
    return response.json();
  } catch (error: any) {
    throw new Error(`API request error: ${error.status}`);
  }
}
