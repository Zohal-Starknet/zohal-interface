import { useAccount, useProvider } from "@starknet-react/core";
import { Contract, uint256 } from "starknet";

import deposit_handler_abi from "../../../trade/abi/deposit_handler.json";
import erc_20_abi from "../../../trade/abi/erc_20.json";

const DEPOSIT_HANDLER_CONTRACT_ADDRESS =
  "0xca895e639e3e3acb258cfd858942278a6ea2b45ef43e720bcc4265fe792dee";

const ETH_CONTRACT_ADDRESS =
  "0x3fa46510b749925fb3fa02e98195909683eaee8d4c982cc647cd98a7f160905";

const USDC_CONTRACT_ADDRESS =
  "0x636d15cd4dfe130c744282f86496077e089cb9dc96ccc37bf0d85ea358a5760";

const MARKET_TOKEN_CONTRACT_ADDRESS =
  "0x68ad9440759f0bd0367e407d53b5e5c32203590f12d54ed8968f48fee0cf636";

const DEPOSIT_VAULT_CONTRACT_ADDRESS =
  "0x1f5f07df40c02afd897f196028fd2eaf4de35a7fee60b25d1decce9910eb962";

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
