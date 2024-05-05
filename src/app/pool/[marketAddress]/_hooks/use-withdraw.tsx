import { useAccount, useProvider } from "@starknet-react/core";
import { Contract, uint256 } from "starknet";

import erc_20_abi from "../../../trade/abi/erc_20.json";

const WITHDRAWAL_HANDLER_CONTRACT_ADDRESS = "";

const ETH_CONTRACT_ADDRESS =
  "0x3fa46510b749925fb3fa02e98195909683eaee8d4c982cc647cd98a7f160905";

const USDC_CONTRACT_ADDRESS =
  "0x636d15cd4dfe130c744282f86496077e089cb9dc96ccc37bf0d85ea358a5760";

const MARKET_TOKEN_CONTRACT_ADDRESS =
  "0x68ad9440759f0bd0367e407d53b5e5c32203590f12d54ed8968f48fee0cf636";

const WITHDRAWAL_VAULT_CONTRACT_ADDRESS = "";

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
      uint256.bnToUint256(BigInt("1000000000000000000")),
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
      min_long_token_amount: uint256.bnToUint256(BigInt("2500000000000")),
      min_short_token_amount: uint256.bnToUint256(BigInt("2500000000000")),
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
