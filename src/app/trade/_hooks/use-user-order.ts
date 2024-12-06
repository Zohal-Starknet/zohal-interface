import { useAccount, useProvider, useReadContract } from "@starknet-react/core";
import {
  DATA_STORE_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  READER_CONTRACT_ADDRESS,
  REFERRAL_STORAGE_CONTRACT_ADDRESS,
  EXCHANGE_ROUTER_CONTRACT_ADDRESS,
  ETH_CONTRACT_ADDRESS,
  ORDER_VAULT_CONTRACT_ADDRESS,
  BTC_MARKET_TOKEN_CONTRACT_ADDRESS,
  STRK_MARKET_TOKEN_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { useEffect, useState } from "react";
import { BlockTag, CairoCustomEnum, Contract, uint256 } from "starknet";

import erc_20_abi from "../abi/erc_20.json";
import reader_abi from "../../pool/_abi/reader_abi.json";
import exchange_router_abi from "../abi/exchange_router.json";
import datastore_abi from "../abi/datastore.json";
import useEthPrice from "./use-market-data";
import useBtcPrice from "./use-market-data-btc";
import useStrkPrice from "./use-market-data-strk";

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

export default function useUserOrder() {
  const { ethData } = useEthPrice();
  const { btcData } = useBtcPrice();
  const { strkData } = useStrkPrice();
  const { account, address } = useAccount();
  const { provider } = useProvider();

  const { data: allOrders } = useReadContract({
    address: DATA_STORE_CONTRACT_ADDRESS,
    abi: datastore_abi.abi,
    // enabled: address !== undefined && ethData.currentPrice !== 0,
    // enabled: ethData.currentPrice !== 0,
    functionName: "get_account_all_position",
    blockIdentifier: BlockTag.PENDING,
    watch: true,
    args: [
      "0x027ef9ac376e49aa4a8638d2f27b2a7dc8e19a975cffb15ca278919cfb2820ac",
      0,
      10,
    ],
  });

  const orders = allOrders as Array<Position>;

  return { orders };
}
