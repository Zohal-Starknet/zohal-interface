import {
  useAccount,
  useContract,
  useProvider,
  useReadContract,
  useSendTransaction,
  useTransactionReceipt,
} from "@starknet-react/core";
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
import {
  Abi,
  BlockTag,
  CairoCustomEnum,
  Contract,
  provider,
  uint256,
} from "starknet";

import erc_20_abi from "../abi/erc_20.json";
import exchange_router_abi from "../abi/exchange_router.json";
import datastore_abi from "../abi/datastore.json";
import useEthPrice from "./use-market-data";
import useBtcPrice from "./use-market-data-btc";
import useStrkPrice from "./use-market-data-strk";
import { useToast } from "@zohal/app/_ui/use-toast";

export type Order = {
  key: bigint;
  order_type: CairoCustomEnum;
  account: string;
  market: string;
  initial_collateral_token: string;
  size_delta_usd: bigint;
  initial_collateral_delta_amount: bigint;
  trigger_price: bigint;
  acceptable_price: bigint;
  min_output_amount: bigint;
  is_long: boolean;
  is_frozen: boolean;
  decrease_position_swap_type: CairoCustomEnum;
  receiver: string;
  callback_contract: string;
  ui_fee_receiver: string;
  swap_path: Array<string>;
  execution_fee: bigint;
  callback_gas_limit: bigint;
  updated_at_block: bigint;
};

export const defaultOrder: Order = {
  key: BigInt(0),
  order_type: { LimitDecrease: {} } as unknown as CairoCustomEnum, // Exemple d'initialisation pour CairoCustomEnum
  account: "",
  market: "",
  initial_collateral_token: "",
  size_delta_usd: BigInt(0),
  initial_collateral_delta_amount: BigInt(0),
  trigger_price: BigInt(0),
  acceptable_price: BigInt(0),
  min_output_amount: BigInt(0),
  is_long: false,
  is_frozen: false,
  decrease_position_swap_type: {
    LimitDecrease: {},
  } as unknown as CairoCustomEnum, // Exemple d'initialisation pour CairoCustomEnum
  receiver: "",
  callback_contract: "",
  ui_fee_receiver: "",
  swap_path: [],
  execution_fee: BigInt(0),
  callback_gas_limit: BigInt(0),
  updated_at_block: BigInt(0),
};

export default function useUserOrder(
  order: Order,
  key: bigint,
  new_size_delta_usd: bigint,
  trigger_price: bigint,
) {
  const { toast } = useToast();
  let trigger_price_formatted = trigger_price * BigInt(10 ** 10);
  if (order.market == BTC_MARKET_TOKEN_CONTRACT_ADDRESS) {
    trigger_price_formatted = trigger_price * BigInt(10 ** 20);
  }
  if (order.market == STRK_MARKET_TOKEN_CONTRACT_ADDRESS) {
    trigger_price_formatted = trigger_price * BigInt(10 ** 10);
  }

  const { account, address } = useAccount();
  const { contract: exchangeRouterContract } = useContract({
    abi: exchange_router_abi.abi as Abi,
    address: EXCHANGE_ROUTER_CONTRACT_ADDRESS,
  });

  const {
    send: sendEdit,
    data: editOrderTransactionData,
    isPending: isPendingEdit,
  } = useSendTransaction({
    calls:
      account && address
        ? [
            exchangeRouterContract.populate("update_order", [
              key,
              new_size_delta_usd,
              order.is_long
                ? uint256.bnToUint256(
                    BigInt(
                      (trigger_price_formatted * BigInt(105)) / BigInt(100),
                    ),
                  )
                : uint256.bnToUint256(
                    BigInt(
                      (trigger_price_formatted * BigInt(105)) / BigInt(100),
                    ),
                  ),
              trigger_price_formatted,
              BigInt(0),
            ]),
          ]
        : undefined,
  });

  const { isLoading: isLoadingEdit, isSuccess: isSuccessEdit } =
    useTransactionReceipt({
      hash: editOrderTransactionData?.transaction_hash,
    });

  const {
    send: sendCancel,
    data: cancelOrderTransactionData,
    isPending: isPendingCancel,
  } = useSendTransaction({
    calls:
      account && address
        ? [exchangeRouterContract.populate("cancel_order", [key])]
        : undefined,
  });

  const {
    data,
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
  } = useTransactionReceipt({
    hash: cancelOrderTransactionData?.transaction_hash,
  });

  useEffect(() => {
    if (isSuccessCancel) {
      toast({
        title: "Canceled order",
        description: "Transaction Accepted on L2",
      });
    }
  }, [isSuccessCancel, toast]);

  const { data: allOrders } = useReadContract({
    address: DATA_STORE_CONTRACT_ADDRESS,
    abi: datastore_abi.abi,
    // enabled: address !== undefined && ethData.currentPrice !== 0,
    // enabled: ethData.currentPrice !== 0,
    functionName: "get_account_all_order",
    blockIdentifier: BlockTag.PENDING,
    watch: true,
    args: [address, 0, 10],
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

  return {
    orders,
    orders_count,
    sendCancel,
    sendEdit,
    isLoadingCancel,
    isSuccessCancel,
    isLoadingEdit,
    isSuccessEdit,
  };
}
