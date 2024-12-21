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
import { BlockTag, CairoCustomEnum, Contract, provider, uint256 } from "starknet";

import erc_20_abi from "../abi/erc_20.json";
import exchange_router_abi from "../abi/exchange_router.json";
import datastore_abi from "../abi/datastore.json";

export type Order = {
  key: bigint,
  order_type: CairoCustomEnum,
  account: string,
  market: string,
  initial_collateral_token: string,
  size_delta_usd: bigint,
  initial_collateral_delta_amount: bigint,
  trigger_price: bigint,
  acceptable_price: bigint,
  min_output_amount: bigint,
  is_long: boolean,
  is_frozen: boolean,
  decrease_position_swap_type: CairoCustomEnum,
  receiver: string,
  callback_contract: string,
  ui_fee_receiver: string,
  swap_path: Array<string>,
  execution_fee: bigint,
  callback_gas_limit: bigint,
  updated_at_block: bigint,
};

export default function useGetOrder() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  const { data: allOrders } = useReadContract({
    address: DATA_STORE_CONTRACT_ADDRESS,
    abi: datastore_abi.abi,
    // enabled: address !== undefined && ethData.currentPrice !== 0,
    // enabled: ethData.currentPrice !== 0,
    functionName: "get_account_all_order",
    blockIdentifier: BlockTag.PENDING,
    watch: true,
    args: [address, 0, 20],
  });

  const { data: ordersCount } = useReadContract({
    address: DATA_STORE_CONTRACT_ADDRESS,
    abi: datastore_abi.abi,
    // enabled: address !== undefined && ethData.currentPrice !== 0,
    // enabled: ethData.currentPrice !== 0,
    functionName: "get_account_order_count",
    blockIdentifier: BlockTag.PENDING,
    watch: true,
    args: [address],
  });

  const orders = allOrders as Array<Order>;
  const orders_count = ordersCount ? Number(ordersCount) : 0;

  return { orders, orders_count };
}
