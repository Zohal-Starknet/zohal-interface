import {
  BTC_CONTRACT_ADDRESS,
  BTC_MARKET_TOKEN_CONTRACT_ADDRESS,
  ETH_CONTRACT_ADDRESS,
  ETH_MARKET_TOKEN_CONTRACT_ADDRESS,
  STRK_CONTRACT_ADDRESS,
  STRK_MARKET_TOKEN_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from "../_lib/addresses";

type TokenList = Record<
  string,
  {
    address: `0x${string}`;
    decimals: number;
    icon: string;
    name: string;
    marketAddress: `0x${string}`;
  }
>;

export const Tokens: TokenList = {
  ETH: {
    address: ETH_CONTRACT_ADDRESS,
    decimals: 18,
    icon: "/tokens/ethereum.png",
    name: "Ethereum",
    marketAddress: ETH_MARKET_TOKEN_CONTRACT_ADDRESS,
  },
  USDC: {
    address: USDC_CONTRACT_ADDRESS,
    decimals: 6,
    icon: "/tokens/usdc.png",
    name: "USD",
    marketAddress: USDC_CONTRACT_ADDRESS,
  },
  BTC: {
    address: BTC_CONTRACT_ADDRESS,
    decimals: 8,
    icon: "/tokens/wbtc.png",
    name: "Bitcoin",
    marketAddress: BTC_MARKET_TOKEN_CONTRACT_ADDRESS,
  },
  STRK: {
    address: STRK_CONTRACT_ADDRESS,
    decimals: 18,
    icon: "/tokens/strk.png",
    name: "Stark",
    marketAddress: STRK_MARKET_TOKEN_CONTRACT_ADDRESS,
  },
} as const;

export type TokenSymbol = keyof typeof Tokens;
