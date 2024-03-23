import { type TokenSymbol } from "./tokens";

type MarketList = Record<`0x${string}`, TokenSymbol>;

export const Markets: MarketList = {
  "0x00": "ETH",
} as const;
