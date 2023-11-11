type TokenList = Record<
  string,
  { address: `0x${string}`; decimals: number; name: string }
>;

export const TOKENS: TokenList = {
  ETH: {
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    decimals: 18,
    name: "Ethereum",
  },
  WBTC: {
    address:
      "0x012d537dc323c439dc65c976fad242d5610d27cfb5f31689a0a319b8be7f3d56",
    decimals: 8,
    name: "Wrapped BTC",
  },
};

export type TokenSymbol = keyof typeof TOKENS;
