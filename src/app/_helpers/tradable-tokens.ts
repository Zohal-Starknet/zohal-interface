import {
  BTC_CONTRACT_ADDRESS,
  ETH_CONTRACT_ADDRESS,
  STRK_CONTRACT_ADDRESS,
} from "../_lib/addresses";

type TokenList = Record<
  string,
  { address: `0x${string}`; decimals: number; icon: string; name: string }
>;

export const TradableTokens: TokenList = {
  ETH: {
    address: ETH_CONTRACT_ADDRESS,
    decimals: 18,
    icon: "/tokens/ethereum.png",
    name: "Ethereum",
  },
  BTC: {
    address: BTC_CONTRACT_ADDRESS,
    decimals: 8,
    icon: "/tokens/wbtc.png",
    name: "Bitcoin",
  },
  STRK: {
    address: STRK_CONTRACT_ADDRESS,
    decimals: 18,
    icon: "/tokens/strk.png",
    name: "Stark",
  },
} as const;

export type TokenSymbol = keyof typeof TradableTokens;
