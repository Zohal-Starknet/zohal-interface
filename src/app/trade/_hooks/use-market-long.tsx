import { useAccount, useProvider } from "@starknet-react/core";
import {
  ETH_CONTRACT_ADDRESS,
  ORACLE_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  ORDER_HANDLER_CONTRACT_ADDRESS,
  ORDER_VAULT_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { Tokens } from "@zohal/app/_helpers/tokens";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import erc_20_abi from "../abi/erc_20.json";
import order_handler_abi from "../abi/order_handler.json";

//@ts-ignore
export default function useMarketLong() {
  const { account, address } = useAccount();
  const { provider } = useProvider();

  const oracleAbi = [
    {
      inputs: [
        {
          name: "token",
          type: "core::starknet::contract_address::ContractAddress",
        },
      ],
      name: "get_primary_price",
      outputs: [
        {
          type: "satoru::price::price::Price",
        },
      ],
      state_mutability: "view",
      type: "function",
    },
    {
      members: [
        {
          name: "min",
          type: "core::integer::u256",
        },
        {
          name: "max",
          type: "core::integer::u256",
        },
      ],
      name: "satoru::price::price::Price",
      type: "struct",
    },
  ];

  //@ts-ignore
  async function long(tokenSymbol, tokenAmount) {
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
      order_handler_abi.abi,
      ORDER_HANDLER_CONTRACT_ADDRESS,
      provider,
    );

    const oracleContract = new Contract(
      oracleAbi,
      ORACLE_CONTRACT_ADDRESS,
      provider,
    );

    const oraclePrice =
    (await oracleContract.functions.get_primary_price(
      tokenSymbol.address,
    )) as { max: bigint; min: bigint };
    

    const createOrderParams = {
      acceptable_price: uint256.bnToUint256(oraclePrice.min),
      callback_contract: 0,
      callback_gas_limit: uint256.bnToUint256(0),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      execution_fee: uint256.bnToUint256(0),
      initial_collateral_delta_amount: uint256.bnToUint256(
        BigInt(tokenAmount),
      ),
      initial_collateral_token: tokenSymbol.address,
      is_long: true, 
      market: MARKET_TOKEN_CONTRACT_ADDRESS, //TODO
      min_output_amount: uint256.bnToUint256(0),
      order_type: new CairoCustomEnum({ MarketIncrease: {} }),
      receiver: address,
      referral_code: 0,
      size_delta_usd: uint256.bnToUint256(oraclePrice.min * BigInt(tokenAmount * (10 ** tokenSymbol.decimals))),
      swap_path: [],
      trigger_price: uint256.bnToUint256(oraclePrice.min), 
      ui_fee_receiver: 0,
    };

    const createOrderCall = orderHandlerContract.populate("create_order", [
      address,
      createOrderParams,
    ]);

    void account.execute([transferCall, createOrderCall]);
  }

  return { long };
}
