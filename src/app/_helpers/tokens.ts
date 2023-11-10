export const TOKENS: Record<string, { address: `0x${string}`; name: string }> =
  {
    ETH: {
      address:
        "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7",
      name: "Ethereum",
    },
    WBTC: {
      address:
        "0x012d537dc323c439dc65c976fad242d5610d27cfb5f31689a0a319b8be7f3d56",
      name: "Wrapped BTC",
    },
  };

export type TokenSymbol = keyof typeof TOKENS;
