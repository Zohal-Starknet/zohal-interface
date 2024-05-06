import { useAccount, useProvider } from "@starknet-react/core";
import {
  DEPOSIT_HANDLER_CONTRACT_ADDRESS,
  DEPOSIT_VAULT_CONTRACT_ADDRESS,
  ETH_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { Contract, uint256 } from "starknet";

import deposit_handler_abi from "../../../trade/abi/deposit_handler.json";
import erc_20_abi from "../../../trade/abi/erc_20.json";

export default function useDeposit() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  function deposit() {
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
      uint256.bnToUint256(BigInt("1000000000000000000")),
    ]);

    const usdcTokenContract = new Contract(
      erc_20_abi.abi,
      USDC_CONTRACT_ADDRESS,
      provider,
    );

    const usdcTransferCall = usdcTokenContract.populate("transfer", [
      DEPOSIT_VAULT_CONTRACT_ADDRESS,
      uint256.bnToUint256(BigInt("1000000000000000000")),
    ]);

    const depositHandlerContract = new Contract(
      deposit_handler_abi.abi,
      DEPOSIT_HANDLER_CONTRACT_ADDRESS,
      provider,
    );

    const createDepositParams = {
      callback_contract: 0,
      callback_gas_limit: uint256.bnToUint256(0),
      execution_fee: uint256.bnToUint256(0),
      initial_long_token: ETH_CONTRACT_ADDRESS,
      initial_short_token: USDC_CONTRACT_ADDRESS,
      long_token_swap_path: [],
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      min_market_tokens: 0,
      receiver: address,
      short_token_swap_path: [],
      ui_fee_receiver: 0,
    };

    const createDepositCall = depositHandlerContract.populate(
      "create_deposit",
      [address, createDepositParams],
    );

    void account.execute([
      ethTransferCall,
      usdcTransferCall,
      createDepositCall,
    ]);
  }

  return { deposit };
}
