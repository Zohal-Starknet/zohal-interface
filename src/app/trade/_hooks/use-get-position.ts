import { useAccount, useProvider, useReadContract } from "@starknet-react/core";
import {
  DATA_STORE_CONTRACT_ADDRESS
} from "@zohal/app/_lib/addresses";
import { BlockTag } from "starknet";

import datastore_abi from "../abi/datastore.json";
import { usePriceDataSubscription } from "./use-market-data";

export type Position = {
  account: bigint;
  borrowing_factor: bigint;
  collateral_amount: bigint;
  collateral_token: string;
  decreased_at_block: bigint;
  funding_fee_amount_per_size: bigint;
  increased_at_block: bigint;
  is_long: boolean;
  key: bigint;
  long_token_claimable_funding_amount_per_size: bigint;
  market: string;
  short_token_claimable_funding_amount_per_size: bigint;
  size_in_tokens: bigint;
  size_in_usd: bigint;
};

export default function useGetPosition() {
  const { tokenData: ethData } = usePriceDataSubscription({ pairSymbol: "ETH/USD" });
  const { tokenData: btcData } = usePriceDataSubscription({ pairSymbol: "BTC/USD" });
  const { tokenData: strkData } = usePriceDataSubscription({ pairSymbol: "STRK/USD" });
  const { account, address } = useAccount();
  const { provider } = useProvider();

  const { data: allPositions } = useReadContract({
    address: DATA_STORE_CONTRACT_ADDRESS,
    abi: datastore_abi.abi,
    // enabled: address !== undefined && ethData.currentPrice !== 0,
    enabled: ethData.currentPrice !== 0,
    functionName: "get_account_all_position",
    blockIdentifier: BlockTag.PENDING,
    watch: true,
    args: [address, 0, 10],
  });

  const { data: positionsCount } = useReadContract({
    address: DATA_STORE_CONTRACT_ADDRESS,
    abi: datastore_abi.abi,
    // enabled: address !== undefined && ethData.currentPrice !== 0,
    // enabled: ethData.currentPrice !== 0,
    functionName: "get_account_position_count",
    blockIdentifier: BlockTag.PENDING,
    watch: true,
    args: [address],
  });

  const positions = allPositions as Array<Position>;
  const positions_count = positionsCount ? Number(positionsCount) : 0;

  return { positions, positions_count };
}
