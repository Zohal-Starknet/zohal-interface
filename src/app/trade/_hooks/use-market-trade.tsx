import { useAccount, useProvider } from "@starknet-react/core";
import {
  ETH_CONTRACT_ADDRESS,
  ORACLE_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  ORDER_HANDLER_CONTRACT_ADDRESS,
  ORDER_VAULT_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import erc_20_abi from "../abi/erc_20.json";
import router_abi from "../abi/router.json";
import oracle_abi from "../abi/oracle.json";

//@ts-ignore
export default function useMarketTrade() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  //@ts-ignore
  async function trade(tokenSymbol, tokenAmount, isLong) {
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
      uint256.bnToUint256(BigInt(tokenAmount * (10 ** tokenSymbol.decimals))),
    ]);

    const orderHandlerContract = new Contract(
      router_abi.abi,
      ORDER_HANDLER_CONTRACT_ADDRESS,
      provider,
    );

    const oracleContract = new Contract(
      oracle_abi.abi,
      ORACLE_CONTRACT_ADDRESS,
      provider,
    );

    const oraclePrice = (await oracleContract.functions.get_primary_price(
      tokenSymbol.address,
    )) as { max: bigint; min: bigint };

    const orderKey = generateOrderKey(address, MARKET_TOKEN_CONTRACT_ADDRESS, tokenSymbol.address);

    const orderParams = {
      key: orderKey,
      order_type: new CairoCustomEnum({ MarketIncrease: {} }),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      account: address,
      receiver: address,
      callback_contract: 0,
      ui_fee_receiver: 0,
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      initial_collateral_token: tokenSymbol.address,
      swap_path: [], 
      size_delta_usd: uint256.bnToUint256(oraclePrice.min * BigInt(tokenAmount * (10 ** tokenSymbol.decimals))),
      initial_collateral_delta_amount: uint256.bnToUint256(BigInt(tokenAmount)),
      trigger_price: uint256.bnToUint256(oraclePrice.min),
      acceptable_price: uint256.bnToUint256(oraclePrice.min),
      execution_fee: uint256.bnToUint256(0),
      callback_gas_limit: uint256.bnToUint256(0),
      min_output_amount: uint256.bnToUint256(0),
       //@ts-ignore
      updated_at_block: BigInt(await provider.getBlockNumber()),
      is_long: new CairoCustomEnum(isLong ? { True: {} } : { False: {} }),
      is_frozen: new CairoCustomEnum({ False: {} })
    };

    const setOrderCall = orderHandlerContract.populate("set_order", [
      orderKey,
      orderParams,
    ]);

    void account.execute([transferCall, setOrderCall]);
  }

   //@ts-ignore
  function long(tokenSymbol, tokenAmount) {
    return trade(tokenSymbol, tokenAmount, true);
  }

   //@ts-ignore
  function short(tokenSymbol, tokenAmount) {
    return trade(tokenSymbol, tokenAmount, false);
  }

  return { long, short };
}

 //@ts-ignore
function generateOrderKey(account, market, token) {
  // Implement a function to generate a unique order key based on the account, market, and token.
  // This is just a placeholder and should be implemented based on your application's logic.
  return `0x${BigInt(account).toString(16)}${BigInt(market).toString(16)}${BigInt(token).toString(16)}`;
}
