type TokenList = Record<
  string,
  { address: `0x${string}`; decimals: number; icon: string; name: string }
>;

export const Tokens: TokenList = {
  ETH: {
    address:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    decimals: 18,
    icon: "/tokens/ethereum.png",
    name: "Ethereum",
  },
  WBTC: {
    address:
      "0x012d537dc323c439dc65c976fad242d5610d27cfb5f31689a0a319b8be7f3d56",
    decimals: 8,
    icon: "/tokens/wbtc.png",
    name: "Wrapped BTC",
  },
} as const;

export type TokenSymbol = keyof typeof Tokens;
