import { useAccount, useProvider } from "@starknet-react/core";
import {
  MARKET_TOKEN_CONTRACT_ADDRESS,
  EXCHANGE_ROUTER_CONTRACT_ADDRESS,
  ORDER_VAULT_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import erc_20_abi from "../abi/erc_20.json";
import exchange_router_abi from "../abi/exchange_router.json";

//@ts-ignore
export default function useMarketTrade() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  //@ts-ignore
  async function trade(tokenSymbol, tokenAmount, isLong, leverage) {
    if (account === undefined || address === undefined) {
      return;
    }

    const tokenContract = new Contract(
      erc_20_abi.abi,
      tokenSymbol.address,
      provider,
    );

    const transferCall = tokenContract.populate("transfer", [
      ORDER_VAULT_CONTRACT_ADDRESS,
      uint256.bnToUint256(BigInt(parseInt(tokenAmount)) * BigInt(10 ** tokenSymbol.decimals)),
    ]);

    const createOrderParams = {
      receiver: address,
      callback_contract: 0,
      ui_fee_receiver: 0,
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      initial_collateral_token: tokenSymbol.address,
      swap_path: [], 
      size_delta_usd: uint256.bnToUint256(BigInt(leverage) * BigInt(3500) * BigInt(tokenAmount * (10 ** tokenSymbol.decimals))),
      initial_collateral_delta_amount: uint256.bnToUint256(BigInt(tokenAmount)),
      trigger_price: uint256.bnToUint256(0),
      acceptable_price: uint256.bnToUint256(BigInt(3500)),
      execution_fee: uint256.bnToUint256(0),
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

    const createOrderCall = exchangeRouterContract.populate("create_order", [
      createOrderParams,
    ]);

    await account.execute([transferCall, createOrderCall]);
  }

  return { trade };
}