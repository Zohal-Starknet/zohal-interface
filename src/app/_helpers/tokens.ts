import { ETH_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS, ZOH_CONTRACT_ADDRESS } from "../_lib/addresses";

type TokenList = Record<
  string,
  { address: `0x${string}`; decimals: number; icon: string; name: string }
>;

export const Tokens: TokenList = {
  ETH: {
    address: ETH_CONTRACT_ADDRESS,
    decimals: 18,
    icon: "/tokens/ethereum.png",
    name: "Ethereum",
  },
  ZOH: {
    address: ZOH_CONTRACT_ADDRESS,
    decimals: 18,
    icon: "/tokens/zoh.png",
    name: "Zohal",
  },
  USDC: {
    address: USDC_CONTRACT_ADDRESS,
    decimals: 18,
    icon: "/tokens/usdc.png",
    name: "USD",
  },
} as const;

export type TokenSymbol = keyof typeof Tokens;
