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
import router_abi from "../abi/router.json";

export default function useMarketSwap() {
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

    const oraclePrice = (await oracleContract.functions.get_primary_price(
      Tokens[selectedToken].address,
    )) as { max: bigint; min: bigint };
    
    const routerContract = new Contract(
      router_abi.abi,
      ORDER_HANDLER_CONTRACT_ADDRESS,
      provider,
    );

    const orderKey = generateOrderKey(address, MARKET_TOKEN_CONTRACT_ADDRESS, Tokens[selectedToken].address);

    const setOrderParams = {
      key: orderKey,
      order_type: new CairoCustomEnum({ MarketSwap: {} }),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      account: address,
      receiver: address,
      callback_contract: 0,
      ui_fee_receiver: 0,
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      initial_collateral_token: Tokens[selectedToken].address,
      swap_path: [MARKET_TOKEN_CONTRACT_ADDRESS], // Ensure proper path format
      size_delta_usd: uint256.bnToUint256(oraclePrice.min * BigInt(amount * (10 ** Tokens[selectedToken].decimals))),
      initial_collateral_delta_amount: uint256.bnToUint256(BigInt(amount)),
      trigger_price: uint256.bnToUint256(0),
      acceptable_price: uint256.bnToUint256(0),
      execution_fee: uint256.bnToUint256(0),
      callback_gas_limit: uint256.bnToUint256(0),
      min_output_amount: uint256.bnToUint256(0),
      updated_at_block: BigInt(await provider.getBlockNumber()),
      is_long: new CairoCustomEnum({ False: {} }), // Assuming swap is neither long nor short
      is_frozen: new CairoCustomEnum({ False: {} })
    };

    const setOrderCall = routerContract.populate("set_order", [
      orderKey,
      setOrderParams,
    ]);

    void account.execute([transferCall, setOrderCall]);
  }

  return { swap };
}

function generateOrderKey(account, market, token) {
  // Implement a function to generate a unique order key based on the account, market, and token.
  // This is just a placeholder and should be implemented based on your application's logic.
  return `0x${BigInt(account).toString(16)}${BigInt(market).toString(16)}${BigInt(token).toString(16)}`;
}
