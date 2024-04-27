import { useAccount, useProvider } from "@starknet-react/core";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import order_handler_abi from "../abi/order_handler.json";

const ORDER_HANDLER_ADDRESS =
  "0x5a31f46af0fe689409e904781c6a12dcecde04eafebe68c367a808cf186d0a1";

const ETH_CONTRACT_ADDRESS =
  "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

const MARKET_TOKEN_CONTRACT_ADDRESS =
  "0x20383ccaa5da1ce3795def07b6705dff0915b9b41c476012854ade100f49df";

export default function useMarketSwapp() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  function swap() {
    if (account === undefined || address === undefined) {
      return;
    }

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
      initial_collateral_delta_amount: uint256.bnToUint256(10000),
      initial_collateral_token: ETH_CONTRACT_ADDRESS,
      is_long: 0,
      market: 0,
      min_output_amount: uint256.bnToUint256(0),
      order_type: new CairoCustomEnum({ MarketSwap: {} }),
      receiver: address,
      referral_code: 0,
      size_delta_usd: uint256.bnToUint256(1000),
      swap_path: [MARKET_TOKEN_CONTRACT_ADDRESS],
      trigger_price: uint256.bnToUint256(0),
      ui_fee_receiver: 0,
    };

    const createOrderCall = orderHandlerContract.populate("create_order", [
      address,
      createOrderParams,
    ]);

    void account.execute(createOrderCall);
  }
}
