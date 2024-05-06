import { MARKET_TOKEN_CONTRACT_ADDRESS } from "../_lib/addresses";
import { type TokenSymbol } from "./tokens";

type MarketList = Record<`0x${string}`, TokenSymbol>;

export const Markets: MarketList = {
  [MARKET_TOKEN_CONTRACT_ADDRESS]: "ETH",
} as const;
