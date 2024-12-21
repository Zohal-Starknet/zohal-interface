import {
  useAccount,
  useProvider,
  useReadContract,
  useSendTransaction,
  useTransactionReceipt,
} from "@starknet-react/core";
import {
  DATA_STORE_CONTRACT_ADDRESS,
  EXCHANGE_ROUTER_CONTRACT_ADDRESS,
  ORDER_VAULT_CONTRACT_ADDRESS,
  BTC_MARKET_TOKEN_CONTRACT_ADDRESS,
  STRK_MARKET_TOKEN_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { BlockTag, CairoCustomEnum, Contract, uint256 } from "starknet";

import erc_20_abi from "../abi/erc_20.json";
import exchange_router_abi from "../abi/exchange_router.json";
import datastore_abi from "../abi/datastore.json";
import {  usePrices } from "./use-market-data";
import isEqual from "lodash.isequal";
import { useEffect } from "react";
import { useToast } from "@zohal/app/_ui/use-toast";

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

export default function useUserPosition(
  position: Position,
  collateral_amount: bigint,
  order_type: CairoCustomEnum,
  size_delta_usd: bigint,
  trigger_price: bigint,
  onOpenChange: (open: boolean) => void,
  slippage: string,
) {
  // const { tokenData: ethData } = usePriceDataSubscription({
  //   pairSymbol: "ETH/USD",
  // });
  // const { tokenData: btcData } = usePriceDataSubscription({
  //   pairSymbol: "BTC/USD",
  // });
  // const { tokenData: strkData } = usePriceDataSubscription({
  //   pairSymbol: "STRK/USD",
  // });
  const { prices } = usePrices();
  const ethData = prices["ETH/USD"];
  const btcData = prices["BTC/USD"];
  const strkData = prices["STRK/USD"];
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const { toast } = useToast();

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
    isEqual(order_type, { MarketIncrease: {} }) ||
    isEqual(order_type, { MarketDecrease: {} })
  ) {
    if (
      (position.is_long && isEqual(order_type, { MarketIncrease: {} })) ||
      (!position.is_long && isEqual(order_type, { MarketDecrease: {} }))
    ) {
      acceptable_price =
        (price * BigInt(Number(slippage) * 100 + 10000)) / BigInt(10000);
    } else if (
      (position.is_long && isEqual(order_type, { MarketDecrease: {} })) ||
      (!position.is_long && isEqual(order_type, { MarketIncrease: {} }))
    ) {
      acceptable_price = BigInt(
        (price * BigInt(10000 - Number(slippage) * 100)) / BigInt(10000),
      );
    }
  } else {
    if (
      (position.is_long && isEqual(order_type, { LimitDecrease: {} })) ||
      (position.is_long && isEqual(order_type, { LimitIncrease: {} })) ||
      (!position.is_long && isEqual(order_type, { LimitDecrease: {} })) ||
      (!position.is_long && isEqual(order_type, { StopLossDecrease: {} }))
    ) {
      acceptable_price = BigInt(
        (trigger_price_formatted * BigInt(Number(slippage) * 100 + 10000)) /
          BigInt(10000),
      );
    } else if (
      (!position.is_long && isEqual(order_type, { LimitIncrease: {} })) ||
      (position.is_long && isEqual(order_type, { StopLossDecrease: {} }))
    ) {
      acceptable_price = BigInt(
        (trigger_price_formatted * BigInt(10000 - Number(slippage) * 100)) /
          BigInt(10000),
      );
    }
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
      isEqual(order_type, { LimitIncrease: {} })) &&
    collateral_amount > BigInt(0)
  ) {
    const transferCall = usdcContract.populate("transfer", [
      ORDER_VAULT_CONTRACT_ADDRESS,
      uint256.bnToUint256(collateral_amount),
    ]);

    calls.push(transferCall);
  }

  if (account !== undefined || address !== undefined) {
    const createOrderCall = exchangeRouterContract.populate("create_order", [
      createOrderParams,
    ]);
    calls.push(createOrderCall);
  }

  const {
    send,
    data: editPositionTransactionData,
    isPending,
  } = useSendTransaction({
    calls: account && address ? calls : undefined,
  });

  const { isLoading, isSuccess } = useTransactionReceipt({
    hash: editPositionTransactionData?.transaction_hash,
  });

  useEffect(() => {
    if (isLoading) {
      onOpenChange(false);
    }
    if (isSuccess) {
      toast({
        title: "Opened order",
        description: "Transaction accepeted on L2",
      });
    }
  }, [isLoading, isSuccess, toast]);

  return { send, isPending, isLoading };
}
