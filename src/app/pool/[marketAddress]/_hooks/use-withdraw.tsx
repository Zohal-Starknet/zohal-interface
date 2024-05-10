import { useAccount, useProvider } from "@starknet-react/core";
import {
  MARKET_TOKEN_CONTRACT_ADDRESS,
  WITHDRAWAL_HANDLER_CONTRACT_ADDRESS,
  WITHDRAWAL_VAULT_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { Contract, uint256 } from "starknet";

import erc_20_abi from "../../../trade/abi/erc_20.json";

export default function useWithdraw() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  function withdraw() {
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
      uint256.bnToUint256(BigInt("1000000000000000000")), // TODO how much market token link to input
    ]);

    const withdrawalHandlerContract = new Contract(
      withdrawal_vault_abi.abi,
      WITHDRAWAL_HANDLER_CONTRACT_ADDRESS,
      provider,
    );

    const createWithdrawalParams = {
      callback_contract: 0,
      callback_gas_limit: uint256.bnToUint256(0),
      execution_fee: uint256.bnToUint256(0),
      long_token_swap_path: [],
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      min_long_token_amount: uint256.bnToUint256(BigInt("2500000000000")), //TODO combien au minimun je reçois des ETH
      min_short_token_amount: uint256.bnToUint256(BigInt("2500000000000")), //TODO combien au minimun je reçois des USDC
      receiver: address,
      short_token_swap_path: [],
      ui_fee_receiver: 0,
    };

    const createWithdrawalCall = withdrawalHandlerContract.populate(
      "create_withdrawal",
      [address, createWithdrawalParams],
    );

    void account.execute([marketTokenTransferCall, createWithdrawalCall]);
  }

  return { withdraw };
}
