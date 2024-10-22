import { useState } from "react";
import { useAccount, useProvider } from "@starknet-react/core";
import {
  MARKET_TOKEN_CONTRACT_ADDRESS,
  EXCHANGE_ROUTER_CONTRACT_ADDRESS,
  ORDER_VAULT_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { Tokens } from "@zohal/app/_helpers/tokens";
import { CairoCustomEnum, Contract, uint256 } from "starknet";
import erc_20_abi from "../abi/erc_20.json";
import exchange_router_abi from "../abi/exchange_router.json";
import useEthPrice from "./use-market-data";

type TransactionStatus = "idle" | "loading" | "rejected";

export default function useMarketSwap() {
  const { account, address } = useAccount();
  const { ethData } = useEthPrice();
  const { provider } = useProvider();

   //@ts-ignore
  async function swap(selectedToken, amount, oraclePrice) {
    if (account === undefined || address === undefined) {
      return;
    }
    try {
      const tokenContract = new Contract(
        erc_20_abi.abi,
        Tokens[selectedToken].address,
        provider,
      );

      const transferCall = tokenContract.populate("transfer", [
        ORDER_VAULT_CONTRACT_ADDRESS,
        uint256.bnToUint256(BigInt(amount * (10 ** Tokens[selectedToken].decimals))),
      ]);

      const pragma_decimals =  Tokens[selectedToken].name  == "Ethereum" ?  8  : 6 ;
      const price =  Tokens[selectedToken].name == "Ethereum" ? BigInt(ethData.pragmaPrice.toFixed(0)) * BigInt(10**(30)) / BigInt(10**(pragma_decimals - 4)) / BigInt(10**( Tokens[selectedToken].decimals))
      : BigInt("10000000000000000000000000000") ;

      let size_delta_usd = BigInt(amount * (10 ** Tokens[selectedToken].decimals)) * price;
      console.log("Size delta usd: ", size_delta_usd.toString());

      const createOrderParams = {
        receiver: address,
        callback_contract: 0,
        ui_fee_receiver: 0,
        market: 0,
        initial_collateral_token: Tokens[selectedToken].address,
        swap_path: [MARKET_TOKEN_CONTRACT_ADDRESS],
        size_delta_usd: uint256.bnToUint256(size_delta_usd),
        initial_collateral_delta_amount: uint256.bnToUint256(BigInt(amount * 10 ** Tokens[selectedToken].decimals)),
        trigger_price: uint256.bnToUint256(0),
        acceptable_price: uint256.bnToUint256(1),
        execution_fee: uint256.bnToUint256(0),
        callback_gas_limit: uint256.bnToUint256(0),
        min_output_amount: uint256.bnToUint256(0),
        order_type: new CairoCustomEnum({ MarketSwap: {} }),
        decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
        is_long: false,
        referral_code: "0x0",
      };
      const routerContract = new Contract(
        exchange_router_abi.abi,
        EXCHANGE_ROUTER_CONTRACT_ADDRESS,
        provider,
      );

      const createOrderCall = routerContract.populate("create_order", [
        createOrderParams,
      ]);

      await account.execute([transferCall, createOrderCall]);
    } catch (error) {
      console.error(error);
    }
  }

  return {swap };
}
