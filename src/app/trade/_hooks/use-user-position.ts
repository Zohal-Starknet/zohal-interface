import { useAccount, useProvider } from "@starknet-react/core";
import {
  ETH_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  ORACLE_CONTRACT_ADDRESS,
  ORDER_HANDLER_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { useEffect, useState } from "react";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import order_handler_abi from "../abi/order_handler.json";

export type Position = {
  account: bigint;
  borrowing_factor: bigint;
  collateral_amount: bigint;
  collateral_token: bigint;
  decreased_at_block: bigint;
  funding_fee_amount_per_size: bigint;
  increased_at_block: bigint;
  is_long: boolean;
  key: bigint;
  long_token_claimable_funding_amount_per_size: bigint;
  market: bigint;
  short_token_claimable_funding_amount_per_size: bigint;
  size_in_tokens: bigint;
  size_in_usd: bigint;
};

const dataStoreAbi = [
  {
    inputs: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "start",
        type: "core::integer::u32",
      },
      {
        name: "end",
        type: "core::integer::u32",
      },
    ],
    name: "get_account_position_keys",
    outputs: [
      {
        type: "core::array::Array::<core::felt252>",
      },
    ],
    state_mutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "key",
        type: "core::felt252",
      },
    ],
    name: "get_position",
    outputs: [
      {
        type: "satoru::position::position::Position",
      },
    ],
    state_mutability: "view",
    type: "function",
  },
  {
    members: [
      {
        name: "key",
        type: "core::felt252",
      },
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "market",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "collateral_token",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "size_in_usd",
        type: "core::integer::u256",
      },
      {
        name: "size_in_tokens",
        type: "core::integer::u256",
      },
      {
        name: "collateral_amount",
        type: "core::integer::u256",
      },
      {
        name: "borrowing_factor",
        type: "core::integer::u256",
      },
      {
        name: "funding_fee_amount_per_size",
        type: "core::integer::u256",
      },
      {
        name: "long_token_claimable_funding_amount_per_size",
        type: "core::integer::u256",
      },
      {
        name: "short_token_claimable_funding_amount_per_size",
        type: "core::integer::u256",
      },
      {
        name: "increased_at_block",
        type: "core::integer::u64",
      },
      {
        name: "decreased_at_block",
        type: "core::integer::u64",
      },
      {
        name: "is_long",
        type: "core::bool",
      },
    ],
    name: "satoru::position::position::Position",
    type: "struct",
  },
];

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

export default function useUserPosition() {
  const { account, address } = useAccount();

  const { provider } = useProvider();
  const [positions, setPositions] = useState<
    Array<Position & { market_price: bigint }> | undefined
  >(undefined);

  function closeHalfPosition(collateral_token: bigint) {
    if (account === undefined || address === undefined) {
      return;
    }

    const orderHandlerContract = new Contract(
      order_handler_abi.abi,
      ORDER_HANDLER_CONTRACT_ADDRESS,
      provider,
    );

    const createOrderParams = {
      acceptable_price: uint256.bnToUint256(BigInt("7000")),
      callback_contract: 0,
      callback_gas_limit: uint256.bnToUint256(0),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      execution_fee: uint256.bnToUint256(0),
      initial_collateral_delta_amount: uint256.bnToUint256(
        BigInt("1000000000000000000"),
      ),
      initial_collateral_token: collateral_token,
      is_long: true,
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      min_output_amount: uint256.bnToUint256(BigInt("7000000000000000000000")),
      order_type: new CairoCustomEnum({ MarketDecrease: {} }),
      receiver: address,
      referral_code: 0,
      size_delta_usd: uint256.bnToUint256(BigInt("7000000000000000000000")),
      swap_path: [MARKET_TOKEN_CONTRACT_ADDRESS],
      trigger_price: uint256.bnToUint256(BigInt("7000")),
      ui_fee_receiver: 0,
    };

    const createOrderCall = orderHandlerContract.populate("create_order", [
      address,
      createOrderParams,
    ]);

    void account.execute(createOrderCall);
  }

  function closePosition(collateral_token: bigint) {
    if (account === undefined || address === undefined) {
      return;
    }

    const orderHandlerContract = new Contract(
      order_handler_abi.abi,
      ORDER_HANDLER_CONTRACT_ADDRESS,
      provider,
    );

    const createOrderParams = {
      acceptable_price: uint256.bnToUint256(BigInt("7000")),
      callback_contract: 0,
      callback_gas_limit: uint256.bnToUint256(0),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      execution_fee: uint256.bnToUint256(0),
      initial_collateral_delta_amount: uint256.bnToUint256(
        BigInt("1000000000000000000"),
      ),
      initial_collateral_token: collateral_token,
      is_long: true,
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      min_output_amount: uint256.bnToUint256(BigInt("7000000000000000000000")),
      order_type: new CairoCustomEnum({ MarketDecrease: {} }),
      receiver: address,
      referral_code: 0,
      size_delta_usd: uint256.bnToUint256(BigInt("7000000000000000000000")),
      swap_path: [MARKET_TOKEN_CONTRACT_ADDRESS],
      trigger_price: uint256.bnToUint256(BigInt("7000")),
      ui_fee_receiver: 0,
    };

    // const createOrderParams = {
    //   acceptable_price: uint256.bnToUint256(BigInt("6000")),
    //   callback_contract: 0,
    //   callback_gas_limit: uint256.bnToUint256(0),
    //   decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
    //   execution_fee: uint256.bnToUint256(0),
    //   initial_collateral_delta_amount: uint256.bnToUint256(
    //     BigInt("1000000000000000000"),
    //   ),
    //   initial_collateral_token: collateral_token,
    //   is_long: true,
    //   market: MARKET_TOKEN_CONTRACT_ADDRESS,
    //   min_output_amount: uint256.bnToUint256(BigInt("6000000000000000000000")),
    //   order_type: new CairoCustomEnum({ MarketDecrease: {} }),
    //   receiver: address,
    //   referral_code: 0,
    //   size_delta_usd: uint256.bnToUint256(BigInt("6000000000000000000000")),
    //   swap_path: [MARKET_TOKEN_CONTRACT_ADDRESS],
    //   trigger_price: uint256.bnToUint256(BigInt("6000")),
    //   ui_fee_receiver: 0,
    // };

    const createOrderCall = orderHandlerContract.populate("create_order", [
      address,
      createOrderParams,
    ]);

    void account.execute(createOrderCall);
  }

  useEffect(
    // TODO: Use react-query when indexer implemented properly

    () => {
      const fetchPositions = async () => {
        if (address === undefined) {
          return;
        }
        setPositions(undefined);
        const dataStoreContract = new Contract(
          dataStoreAbi,
          "0xd0d138f2bf91e7a25b4d3d7b819e3d1a5de882047eaf314d35279db1fb6b50",
          provider,
        );
        const positionKeys =
          (await dataStoreContract.functions.get_account_position_keys(
            address,
            0,
            1,
          )) as Array<bigint>;

        const oracleContract = new Contract(
          oracleAbi,
          ORACLE_CONTRACT_ADDRESS,
          provider,
        );
        const oracleEthPrice =
          (await oracleContract.functions.get_primary_price(
            ETH_CONTRACT_ADDRESS,
          )) as { max: bigint; min: bigint };

        const positionsRequests: Array<Promise<Position>> = [];

        positionKeys.map((positionKey) => {
          positionsRequests.push(
            dataStoreContract.functions.get_position(
              positionKey,
            ) as Promise<Position>,
          );
        });

        const positionsFromContract = await Promise.all(positionsRequests);
        setPositions(
          positionsFromContract.flatMap((positionFromContract) => {
            if (positionFromContract.collateral_amount === BigInt("0")) {
              return [];
            }
            return [
              {
                ...positionFromContract,
                market_price: oracleEthPrice.min,
              },
            ];
          }),
        );
      };

      void fetchPositions();
    },
    //   TODO: Refresh for each new block
    [address, provider],
  );

  return { closeHalfPosition, closePosition, positions };
}
