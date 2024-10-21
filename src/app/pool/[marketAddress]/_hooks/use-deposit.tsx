import { useAccount, useProvider } from "@starknet-react/core";
import {
  EXCHANGE_ROUTER_CONTRACT_ADDRESS,
  DEPOSIT_VAULT_CONTRACT_ADDRESS,
  ETH_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { Contract, uint256 } from "starknet";

import exchange_router_abi from "../../../trade/abi/exchange_router.json";
import erc_20_abi from "../../../trade/abi/erc_20.json";

export default function useDeposit() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  function deposit(token0: string, token1: string) {
    if (account === undefined || address === undefined) {
      return;
    }

    const ethTokenContract = new Contract(
      erc_20_abi.abi,
      ETH_CONTRACT_ADDRESS,
      provider,
    );

    const ethTransferCall = ethTokenContract.populate("transfer", [
      DEPOSIT_VAULT_CONTRACT_ADDRESS,
      uint256.bnToUint256((BigInt(Number(token0) * 10 ** 18) + BigInt("80000000000000"))),
    ]);

    const usdcTokenContract = new Contract(
      erc_20_abi.abi,
      USDC_CONTRACT_ADDRESS,
      provider,
    );

    const usdcTransferCall = usdcTokenContract.populate("transfer", [
      DEPOSIT_VAULT_CONTRACT_ADDRESS,
      uint256.bnToUint256(BigInt(token1) * BigInt(10 ** 6)),
    ]); 

    const exchangeRouterContract = new Contract(
      exchange_router_abi.abi,
      EXCHANGE_ROUTER_CONTRACT_ADDRESS,
      provider,
    );

    const createDepositParams = {
      receiver: address,
      callback_contract: 0,
      ui_fee_receiver: 0,
      market: MARKET_TOKEN_CONTRACT_ADDRESS, //TODO parametrage du market
      initial_long_token: ETH_CONTRACT_ADDRESS,
      initial_short_token: USDC_CONTRACT_ADDRESS,
      long_token_swap_path: [],
      short_token_swap_path: [],
      min_market_tokens: 0,
      execution_fee: uint256.bnToUint256(BigInt("80000000000000")),
      callback_gas_limit: uint256.bnToUint256(0),
    };

    const createDepositCall = exchangeRouterContract.populate(
      "create_deposit",
      [createDepositParams],
    );

    void account.execute([
      ethTransferCall,
      usdcTransferCall,
      createDepositCall,
    ]);
  }

  return { deposit };
}
