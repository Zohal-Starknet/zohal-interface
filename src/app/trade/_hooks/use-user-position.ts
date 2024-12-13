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
import exchange_router_abi from "../abi/exchange_router.json";
import datastore_abi from "../abi/datastore.json";
import useEthPrice, { PriceData, usePythPriceSubscription } from "./use-market-data";
import useBtcPrice from "./use-market-data-btc";
import useStrkPrice from "./use-market-data-strk";
import isEqual from "lodash.isequal";

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

export default function useUserPosition() {
  const { priceData: ethData } = usePythPriceSubscription("ETH/USD");
  const { priceData: btcData } = usePythPriceSubscription("BTC/USD" );
  const { priceData: strkData } = usePythPriceSubscription("STRK/USD");
  const { account, address } = useAccount();
  const { provider } = useProvider();

  async function editPosition(
    position: Position,
    collateral_amount: bigint,
    order_type: CairoCustomEnum,
    size_delta_usd: bigint,
    trigger_price: bigint,
    onOpenChange: (open: boolean) => void,
    slippage: string
  ) {
    if (account === undefined || address === undefined) {
      return;
    }
    const usdcContract = new Contract(
      erc_20_abi.abi,
      USDC_CONTRACT_ADDRESS,
      provider,
    );

    const pragma_decimals = 8;
    let price =
      (BigInt(ethData.pragmaPrice.toFixed(0)) * BigInt(10 ** 30)) /
      BigInt(10 ** (pragma_decimals - 4)) /
      BigInt(10 ** 18);
    let trigger_price_formatted = trigger_price * BigInt(10 ** 10);
    if (position.market == BTC_MARKET_TOKEN_CONTRACT_ADDRESS) {
      trigger_price_formatted = trigger_price * BigInt(10 ** 20);
      price =
        (BigInt(btcData.pragmaPrice.toFixed(0)) * BigInt(10 ** 30)) /
        BigInt(10 ** (pragma_decimals - 4)) /
        BigInt(10 ** 8);
    }
    if (position.market == STRK_MARKET_TOKEN_CONTRACT_ADDRESS) {
      trigger_price_formatted = trigger_price * BigInt(10 ** 10);
      price =
        (BigInt(strkData.pragmaPrice.toFixed(0)) * BigInt(10 ** 30)) /
        BigInt(10 ** (pragma_decimals - 4)) /
        BigInt(10 ** 18);
    }

    let acceptable_price = BigInt(0);
    if (
      isEqual(order_type, { MarketIncrease: {} }) || isEqual(order_type, { MarketDecrease: {} })
    ) {
      if (
        (position.is_long && isEqual(order_type, { MarketIncrease: {} })) ||
        (!position.is_long && isEqual(order_type, { MarketDecrease: {} }))
      ) {
        console.log("ENTER HERE")
        console.log("real price:", price)
        acceptable_price = (price * BigInt(Number(slippage) + 100)) / BigInt(100)
        console.log("acceptable_price", acceptable_price)

      } 
      else if (
        (position.is_long && isEqual(order_type, { MarketDecrease: {} })) ||
        (!position.is_long && isEqual(order_type, { MarketIncrease: {} }))
      ) {
        acceptable_price = BigInt((price * BigInt(100 - Number(slippage))) / BigInt(100))
      }
    } else {
      if (
        (position.is_long && isEqual(order_type, { LimitIncrease: {} })) ||
        (!position.is_long && isEqual(order_type, { LimitDecrease: {} }))
      ) {
        acceptable_price = BigInt((trigger_price_formatted * BigInt(Number(slippage) + 100)) / BigInt(100))
      } 
      else if (
        (position.is_long && isEqual(order_type, { LimitDecrease: {} })) ||
        (!position.is_long && isEqual(order_type, { LimitIncrease: {} }))
      ) {
        acceptable_price = BigInt((trigger_price_formatted * BigInt(100 - Number(slippage))) / BigInt(100))
      }
    }

    if (acceptable_price == BigInt(0)) {
      return
    }

    const createOrderParams = {
      receiver: address,
      callback_contract: 0,
      ui_fee_receiver: 0,
      market: position.market,
      initial_collateral_token: USDC_CONTRACT_ADDRESS,
      swap_path: [],
      size_delta_usd: uint256.bnToUint256(size_delta_usd),
      initial_collateral_delta_amount: uint256.bnToUint256(collateral_amount),
      trigger_price: uint256.bnToUint256(trigger_price_formatted),
      acceptable_price: uint256.bnToUint256(acceptable_price),
      execution_fee: uint256.bnToUint256("0"),
      callback_gas_limit: uint256.bnToUint256(0),
      min_output_amount: uint256.bnToUint256(BigInt(0)),
      order_type: new CairoCustomEnum(order_type),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      is_long: position.is_long ? true : false,
      referral_code: "0x0",
    };

    const exchangeRouterContract = new Contract(
      exchange_router_abi.abi,
      EXCHANGE_ROUTER_CONTRACT_ADDRESS,
      provider,
    );

    // const transferCall = ethContract.populate("transfer", [
    //   ORDER_VAULT_CONTRACT_ADDRESS,
    //   uint256.bnToUint256(BigInt("80000000000000")),
    // ]);

    const calls = [];

    if (
      (isEqual(order_type, { MarketIncrease: {} }) ||
      isEqual(order_type, { LimitIncrease: {} })) && collateral_amount > BigInt(0)
    ) {
      const transferCall = usdcContract.populate("transfer", [
        ORDER_VAULT_CONTRACT_ADDRESS,
        uint256.bnToUint256(collateral_amount),
      ]);

      calls.push(transferCall);
    }

    const createOrderCall = exchangeRouterContract.populate("create_order", [
      createOrderParams,
    ]);

    calls.push(createOrderCall);

    await account.execute(calls);

    onOpenChange(false)
  }

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

  return { editPosition, positions, positions_count };
}
