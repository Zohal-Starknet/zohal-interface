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

type TransactionStatus = "idle" | "loading" | "rejected";

export default function useMarketSwap() {
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const [status, setStatus] = useState<TransactionStatus>("idle");

   //@ts-ignore
  async function swap(selectedToken, amount, oraclePrice) {
    if (account === undefined || address === undefined) {
      return;
    }
    setStatus("loading");
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

      const createOrderParams = {
        receiver: address,
        callback_contract: 0,
        ui_fee_receiver: 0,
        market: MARKET_TOKEN_CONTRACT_ADDRESS,
        initial_collateral_token: Tokens[selectedToken].address,
        swap_path: [MARKET_TOKEN_CONTRACT_ADDRESS],
        size_delta_usd: uint256.bnToUint256(BigInt(oraclePrice * 10 ** 18) * BigInt(amount * (10 ** Tokens[selectedToken].decimals))),
        initial_collateral_delta_amount: uint256.bnToUint256(BigInt(amount)),
        trigger_price: uint256.bnToUint256(0),
        acceptable_price: uint256.bnToUint256(0),
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
      setStatus("idle");
    } catch (error) {
      console.error(error);
      setStatus("rejected"); 
    }
  }

  return { status, swap };
}
