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

type TransactionStatus = "idle" | "loading" | "rejected";

//@ts-ignore
export default function useTpSl() {
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const [status, setStatus] = useState<TransactionStatus>("idle");

  //@ts-ignore
  async function tpSl(tradedTokenSymbol, positionSize, isLong, triggeredPrice) {
    if (account === undefined || address === undefined) {
      return;
    }

    setStatus("loading");
    try {
      const feeTokenContract = new Contract(
        erc_20_abi.abi,
        FEE_TOKEN_CONTRACT_ADDRESS,
        provider,
      );

      const pragma_decimals = 8;
      let pricePay = BigInt("10000000000000000000000000000");
      let size_delta_usd = uint256.bnToUint256(BigInt(positionSize) * pricePay);
      let trigger_price =
        (BigInt(triggeredPrice.toFixed(0)) * BigInt(10 ** 30)) /
        BigInt(10 ** (pragma_decimals - 4)) /
        BigInt(10 ** Tokens[tradedTokenSymbol].decimals);

      const createOrderParams = {
        receiver: address,
        callback_contract: 0,
        ui_fee_receiver: 0,
        market: Tokens[tradedTokenSymbol].marketAddress,
        initial_collateral_token: USDC_CONTRACT_ADDRESS,
        swap_path: [],
        size_delta_usd: size_delta_usd,
        initial_collateral_delta_amount: 0,
        trigger_price: trigger_price,
        acceptable_price: 0,
        execution_fee: uint256.bnToUint256("80000000000000"),
        callback_gas_limit: uint256.bnToUint256(0),
        min_output_amount: uint256.bnToUint256(0),
        order_type: new CairoCustomEnum({ LimitDecrease: {} }),
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

      const transferCall = feeTokenContract.populate("transfer", [
        ORDER_VAULT_CONTRACT_ADDRESS,
        uint256.bnToUint256(BigInt("80000000000000")),
      ]);

      calls.push(transferCall);

      const createOrderCall = exchangeRouterContract.populate("create_order", [
        createOrderParams,
      ]);

      calls.push(createOrderCall);

      // if (tpPrice) {
      //   const transferCall3 = ethContract.populate("transfer", [
      //     ORDER_VAULT_CONTRACT_ADDRESS,
      //     uint256.bnToUint256(BigInt("80000000000000")),
      // ]);
      // calls.push(transferCall3);
      //   tpPrice =  BigInt(tpPrice) * BigInt(10 ** pragma_decimals);
      //   const tpOrderParams = {
      //     ...createOrderParams,
      //     trigger_price: uint256.bnToUint256(BigInt(tpPrice)),
      //     acceptable_price : isLong ? uint256.bnToUint256(BigInt((tpPrice * BigInt(95) / BigInt(100)))) : uint256.bnToUint256(BigInt((tpPrice * BigInt(105) / BigInt(100)))),
      //     order_type: new CairoCustomEnum({ LimitDecrease: {} }),
      //   };
      //   const createTpOrderCall = exchangeRouterContract.populate("create_order", [
      //     tpOrderParams,
      //   ]);
      //   calls.push(createTpOrderCall);
      // }

      // if (slPrice) {
      //   const transferCall4 = ethContract.populate("transfer", [
      //     ORDER_VAULT_CONTRACT_ADDRESS,
      //     uint256.bnToUint256(BigInt("80000000000000")),
      // ]);
      // calls.push(transferCall4);
      //   slPrice =  BigInt(slPrice) * BigInt(10 ** pragma_decimals);
      //   const slOrderParams = {
      //     ...createOrderParams,
      //     trigger_price: uint256.bnToUint256(BigInt(slPrice)),
      //     acceptable_price : isLong ? uint256.bnToUint256(BigInt((slPrice * BigInt(95) / BigInt(100)))) : uint256.bnToUint256(BigInt((slPrice * BigInt(105) / BigInt(100)))),
      //     order_type: new CairoCustomEnum({ LimitDecrease: {} }),
      //   };
      //   const createSlOrderCall = exchangeRouterContract.populate("create_order", [
      //     slOrderParams,
      //   ]);
      //   calls.push(createSlOrderCall);
      // }

      await account.execute(calls);

      setStatus("idle");
    } catch (error) {
      console.error(error);
      setStatus("rejected");
    }
  }

  return { tpSl };
}
