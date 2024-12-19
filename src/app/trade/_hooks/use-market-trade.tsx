import { useState } from "react";
import { useAccount, useProvider } from "@starknet-react/core";
import {
  EXCHANGE_ROUTER_CONTRACT_ADDRESS,
  ORDER_VAULT_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
  FEE_TOKEN_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import erc_20_abi from "../abi/erc_20.json";
import exchange_router_abi from "../abi/exchange_router.json";
import { Tokens } from "@zohal/app/_helpers/tokens";
import { PriceData } from "./use-market-data";

type TransactionStatus = "idle" | "loading" | "rejected";

//@ts-ignore
export default function useMarketTrade() {
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const [status, setStatus] = useState<TransactionStatus>("idle");

  //@ts-ignore
  async function trade(
    tradedTokenSymbol: string,
    payTokenAmount: number,
    isLong: boolean,
    leverage: number,
    tpPrice: string,
    slPrice: string,
    sizeDeltaTp: string,
    sizeDeltaSl: string,
    collateralDeltaTp: string,
    collateralDeltaSl: string,
    tradedPriceData: PriceData,
    slippage: string,
  ) {
    if (account === undefined || address === undefined) {
      return;
    }
    console.log(tradedTokenSymbol, "tradedTokenSymbol");
    console.log(payTokenAmount, "payTokenAmount");
    console.log(isLong, "isLong");
    console.log(leverage, "leverage");
    console.log(tradedPriceData, "tradedPriceData");

    setStatus("loading");
    try {
      const usdcContract = new Contract(
        erc_20_abi.abi,
        USDC_CONTRACT_ADDRESS,
        provider,
      );

      const feeTokenContract = new Contract(
        erc_20_abi.abi,
        FEE_TOKEN_CONTRACT_ADDRESS,
        provider,
      );

      let pricePay = BigInt("10000000000000000000000000000");

      const pragma_decimals = 8;
      let priceTrade =
        (BigInt(tradedPriceData.pragmaPrice.toFixed(0)) * BigInt(10 ** 30)) /
        BigInt(10 ** (pragma_decimals - 4)) /
        BigInt(10 ** Tokens[tradedTokenSymbol].decimals);
      let acceptable_price = isLong
        ? uint256.bnToUint256(BigInt(priceTrade * BigInt(10000 + Number(slippage) * 100)) / BigInt(10000))
        : uint256.bnToUint256(BigInt(priceTrade * BigInt(10000 - Number(slippage) * 100)) / BigInt(10000));
      let size_delta_usd = uint256.bnToUint256(
        BigInt(leverage) *
          pricePay *
          BigInt(payTokenAmount * 10 ** Tokens["USDC"].decimals),
      );

      console.log(size_delta_usd, "size delta usd");
      console.log(priceTrade, "price TRADE");

      const createOrderParams = {
        receiver: address,
        callback_contract: 0,
        ui_fee_receiver: 0,
        market: Tokens[tradedTokenSymbol].marketAddress,
        initial_collateral_token: USDC_CONTRACT_ADDRESS,
        swap_path: [],
        size_delta_usd: size_delta_usd,
        initial_collateral_delta_amount: uint256.bnToUint256(
          BigInt(payTokenAmount * 10 ** 6),
        ),
        trigger_price: uint256.bnToUint256(0),
        acceptable_price: acceptable_price,
        execution_fee: uint256.bnToUint256("0"),
        callback_gas_limit: uint256.bnToUint256(0),
        min_output_amount: uint256.bnToUint256(0),
        order_type: new CairoCustomEnum({ MarketIncrease: {} }),
        decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
        is_long: isLong ? true : false,
        referral_code: "0x0",
      };

      const exchangeRouterContract = new Contract(
        exchange_router_abi.abi,
        EXCHANGE_ROUTER_CONTRACT_ADDRESS,
        provider,
      );

      const calls = [];

      const transferCall = usdcContract.populate("transfer", [
        ORDER_VAULT_CONTRACT_ADDRESS,
        uint256.bnToUint256(
          BigInt(payTokenAmount * 10 ** Tokens["USDC"].decimals),
        ),
      ]);

      calls.push(transferCall);
      // const transferCall2 = feeTokenContract.populate("transfer", [
      //     ORDER_VAULT_CONTRACT_ADDRESS,
      //     uint256.bnToUint256(BigInt("80000000000000")),
      // ]);

      // calls.push(transferCall2);

      const createOrderCall = exchangeRouterContract.populate("create_order", [
        createOrderParams,
      ]);
      calls.push(createOrderCall);

      if (tpPrice != "") {
        const tpPriceBigint = BigInt(tpPrice) * BigInt(10 ** 16);
        const tpOrderParams = {
          ...createOrderParams,
          initial_collateral_delta_amount: uint256.bnToUint256(BigInt(collateralDeltaTp)),
          trigger_price: uint256.bnToUint256(BigInt(tpPriceBigint)),
          size_delta_usd:
            sizeDeltaTp !== ""
              ? uint256.bnToUint256(BigInt(Number(sizeDeltaTp) * 10 ** 34))
              : size_delta_usd,
          acceptable_price: isLong
            ? uint256.bnToUint256(BigInt(tpPriceBigint * BigInt(10000 - Number(slippage) * 100)) / BigInt(10000))
            : uint256.bnToUint256(BigInt(tpPriceBigint * BigInt(10000 + Number(slippage) * 100)) / BigInt(10000)),
          order_type: new CairoCustomEnum({ LimitDecrease: {} }),
        };
        const createTpOrderCall = exchangeRouterContract.populate(
          "create_order",
          [tpOrderParams],
        );
        calls.push(createTpOrderCall);
      }

      if (slPrice != "") {
        // const transferCall4 = usdcContract.populate("transfer", [
        //   ORDER_VAULT_CONTRACT_ADDRESS,
        //   uint256.bnToUint256(BigInt("80000000000000")),
        // ]);
        // calls.push(transferCall4);
        let slPriceBigint = BigInt(slPrice) * BigInt(10 ** 16);
        const slOrderParams = {
          ...createOrderParams,
          initial_collateral_delta_amount: uint256.bnToUint256(BigInt(collateralDeltaSl)),
          trigger_price: uint256.bnToUint256(BigInt(slPriceBigint)),
          size_delta_usd:
            sizeDeltaSl !== ""
              ? uint256.bnToUint256(BigInt(Number(sizeDeltaSl) * 10 ** 34))
              : size_delta_usd,
          acceptable_price: isLong
            ? uint256.bnToUint256(BigInt(slPriceBigint * BigInt(10000 - Number(slippage) * 100)) / BigInt(10000))
            : uint256.bnToUint256(BigInt(slPriceBigint * BigInt(10000 + Number(slippage) * 100)) / BigInt(10000)),
          order_type: new CairoCustomEnum({ StopLossDecrease: {} }),
        };
        const createSlOrderCall = exchangeRouterContract.populate(
          "create_order",
          [slOrderParams],
        );
        calls.push(createSlOrderCall);
      }

      await account.execute(calls);

      setStatus("idle");
    } catch (error) {
      console.error(error);
      setStatus("rejected");
    }
  }

  return { trade };
}
