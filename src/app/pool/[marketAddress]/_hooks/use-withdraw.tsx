import { useAccount, useProvider } from "@starknet-react/core";
import {
  MARKET_TOKEN_CONTRACT_ADDRESS,
  WITHDRAWAL_VAULT_CONTRACT_ADDRESS,
  EXCHANGE_ROUTER_CONTRACT_ADDRESS
} from "@zohal/app/_lib/addresses";
import { Contract, uint256 } from "starknet";

import erc_20_abi from "../../../trade/abi/erc_20.json";
import exchange_router_abi from "../../../trade/abi/exchange_router.json";


export default function useWithdraw() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  function withdraw(zohInputValue: string) {
    if (account === undefined || address === undefined) {
      return;
    }

    const marketTokenContract = new Contract(
      erc_20_abi.abi,
      MARKET_TOKEN_CONTRACT_ADDRESS,
      provider,
    );

    const marketTokenTransferCall = marketTokenContract.populate("transfer", [
      WITHDRAWAL_VAULT_CONTRACT_ADDRESS,
      uint256.bnToUint256(BigInt(zohInputValue) * BigInt(10 ** 18)), 
    ]);

    const createWithdrawalParams = {
      receiver: address,
      callback_contract: 0,
      ui_fee_receiver: 0,
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      long_token_swap_path: [],
      short_token_swap_path: [],
      min_long_token_amount: uint256.bnToUint256(BigInt("0")), //TODO combien au minimun je reçois des ETH
      min_short_token_amount: uint256.bnToUint256(BigInt("0")), //TODO combien au minimun je reçois des USDC
      callback_gas_limit: uint256.bnToUint256(0),
      execution_fee: uint256.bnToUint256(0),
    };

    const exchangeRouterContract = new Contract(
      exchange_router_abi.abi,
      EXCHANGE_ROUTER_CONTRACT_ADDRESS,
      provider,
    );

    const createWithdrawalCall = exchangeRouterContract.populate(
      "create_withdrawal",
      [address, createWithdrawalParams],
    );

    void account.execute([marketTokenTransferCall, createWithdrawalCall]);
  }

  return { withdraw };
}
