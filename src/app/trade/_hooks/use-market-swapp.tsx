import { useAccount, useProvider } from "@starknet-react/core";
import {
  ORACLE_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  ORDER_HANDLER_CONTRACT_ADDRESS,
  ORDER_VAULT_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { Tokens } from "@zohal/app/_helpers/tokens";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import oracle_abi from "../abi/oracle.json";
import erc_20_abi from "../abi/erc_20.json";
import order_handler_abi from "../abi/order_handler.json";

export default function useMarketSwapp() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  //@ts-ignore
  async function swap(selectedToken, amount) {
    if (account === undefined || address === undefined) {
      return;
    }

    const tokenContract = new Contract(
      erc_20_abi.abi,
      Tokens[selectedToken].address,
      provider,
    );

    const transferCall = tokenContract.populate("transfer", [
      ORDER_VAULT_CONTRACT_ADDRESS,
      uint256.bnToUint256(BigInt(amount * (10 ** Tokens[selectedToken].decimals))),
    ]);

    const oracleContract = new Contract(
      oracle_abi.abi,
      ORACLE_CONTRACT_ADDRESS,
      provider,
    );

    const oraclePrice =
    (await oracleContract.functions.get_primary_price(
      Tokens[selectedToken].address,
    )) as { max: bigint; min: bigint };
    
    const routerContract = new Contract(
      order_handler_abi.abi,
      ORDER_HANDLER_CONTRACT_ADDRESS,
      provider,
    );

    const createOrderParams = {
      acceptable_price: uint256.bnToUint256(0),
      callback_contract: 0,
      callback_gas_limit: uint256.bnToUint256(0),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      execution_fee: uint256.bnToUint256(0),
      initial_collateral_delta_amount: uint256.bnToUint256(
        BigInt(amount * (10 ** Tokens[selectedToken].decimals)),
      ),
      initial_collateral_token: Tokens[selectedToken].address,
      is_long: 0,
      market: 0,
      min_output_amount: uint256.bnToUint256(0),
      order_type: new CairoCustomEnum({ MarketSwap: {} }),
      receiver: address,
      referral_code: 0,
      size_delta_usd: uint256.bnToUint256(oraclePrice.min * BigInt(amount * (10 ** Tokens[selectedToken].decimals)) ),
      swap_path: [MARKET_TOKEN_CONTRACT_ADDRESS], //Todo : address de la pool: routing
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
