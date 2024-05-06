import { useAccount, useProvider } from "@starknet-react/core";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import erc_20_abi from "../abi/erc_20.json";
import order_handler_abi from "../abi/order_handler.json";

const ORDER_HANDLER_ADDRESS =
  "0x31b7c130baf07042222d74d143d4ccc89799ab6ab09f0a10a19cf12900e4caf";

const ETH_CONTRACT_ADDRESS =
  "0x3fa46510b749925fb3fa02e98195909683eaee8d4c982cc647cd98a7f160905";

const MARKET_TOKEN_CONTRACT_ADDRESS =
  "0x68ad9440759f0bd0367e407d53b5e5c32203590f12d54ed8968f48fee0cf636";

const ORDER_VAULT_CONTRACT_ADDRESS =
  "0x26dbfc5e776cd2ff1b9daa04bf5048dabae59feba13dc97a4508b3fdf862440";

export default function useMarketSwapp() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  function swap() {
    if (account === undefined || address === undefined) {
      return;
    }

    const tokenContract = new Contract(
      erc_20_abi.abi,
      ETH_CONTRACT_ADDRESS,
      provider,
    );
    const transferCall = tokenContract.populate("transfer", [
      ORDER_VAULT_CONTRACT_ADDRESS,
      uint256.bnToUint256(BigInt("1000000000000000000")),
    ]);

    const orderHandlerContract = new Contract(
      order_handler_abi.abi,
      ORDER_HANDLER_ADDRESS,
      provider,
    );

    const createOrderParams = {
      acceptable_price: uint256.bnToUint256(0),
      callback_contract: 0,
      callback_gas_limit: uint256.bnToUint256(0),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      execution_fee: uint256.bnToUint256(0),
      initial_collateral_delta_amount: uint256.bnToUint256(
        BigInt("1000000000000000000"),
      ),
      initial_collateral_token: ETH_CONTRACT_ADDRESS,
      is_long: 0,
      market: 0,
      min_output_amount: uint256.bnToUint256(0),
      order_type: new CairoCustomEnum({ MarketSwap: {} }),
      receiver: address,
      referral_code: 0,
      size_delta_usd: uint256.bnToUint256(BigInt("5000000000000000000000")),
      swap_path: [MARKET_TOKEN_CONTRACT_ADDRESS],
      trigger_price: uint256.bnToUint256(0),
      ui_fee_receiver: 0,
    };

    const createOrderCall = orderHandlerContract.populate("create_order", [
      address,
      createOrderParams,
    ]);

    void account.execute([transferCall, createOrderCall]);
  }

  return { swap };
}
