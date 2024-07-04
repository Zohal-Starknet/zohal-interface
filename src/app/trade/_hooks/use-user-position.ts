import { useAccount, useProvider } from "@starknet-react/core";
import {
  EXCHANGE_ROUTER_CONTRACT_ADDRESS,
  DATA_STORE_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  READER_CONTRACT_ADDRESS,
  REFERRAL_STORAGE_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { useEffect, useState } from "react";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import reader_abi from "../../pool/_abi/reader_abi.json";
import exchange_router_abi from "../abi/exchange_router.json";
import datastore_abi from "../abi/datastore.json";

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

export default function useUserPosition() {
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const [positions, setPositions] = useState<
    Array<Position & { market_price: bigint }> | undefined
  >(undefined);

  async function closePosition(collateral_token: bigint) {
    if (account === undefined || address === undefined) {
      return;
    }

    const exchangeRouterContract = new Contract(
      exchange_router_abi.abi,
      EXCHANGE_ROUTER_CONTRACT_ADDRESS,
      provider,
    );

    const setOrderParams = {
      acceptable_price: uint256.bnToUint256(BigInt("7000")), //TODO: Oracle price
      callback_contract: 0,
      callback_gas_limit: uint256.bnToUint256(0),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      execution_fee: uint256.bnToUint256(0),
      initial_collateral_delta_amount: uint256.bnToUint256(BigInt("1000000000000000000")),
      initial_collateral_token: collateral_token,
      is_long: true, // Adjust as needed
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      min_output_amount: uint256.bnToUint256(BigInt("7000000000000000000000")), //TODO: Oracle price * input
      order_type: new CairoCustomEnum({ MarketDecrease: {} }),
      receiver: address,
      referral_code: 0,
      size_delta_usd: uint256.bnToUint256(BigInt("7000000000000000000000")), //TODO: Oracle price * input
      swap_path: [MARKET_TOKEN_CONTRACT_ADDRESS],
      trigger_price: uint256.bnToUint256(BigInt("7000")), // TODO: Oracle price
      ui_fee_receiver: 0,
      updated_at_block: BigInt(await provider.getBlockNumber()),
      is_frozen: false,
    };

    const setOrderCall = exchangeRouterContract.populate("create_order", [
      setOrderParams,
    ]);

    await account.execute(setOrderCall);
  }

  useEffect(() => {
    const fetchPositions = async () => {
      if (address === undefined) {
        return;
      }
      setPositions(undefined);

      const dataStoreContract = new Contract(
        datastore_abi.abi,
        DATA_STORE_CONTRACT_ADDRESS,
        provider,
      );

      const positionKeys = (await dataStoreContract.get_account_position_keys(
        address,
        0,
        10,
      )) as Array<bigint>;


       //@ts-ignore
      const readerContract = new Contract(
        reader_abi.abi,
        READER_CONTRACT_ADDRESS,
        provider,
      );

      const positionsInfos: Array<
        Promise<{ base_pnl_usd: { mag: bigint; sign: bigint } }>
      > = [];

      positionKeys.map((positionKey) => {
        positionsInfos.push(
          readerContract.functions.get_position_info(
            {
              contract_address: DATA_STORE_CONTRACT_ADDRESS,
            },
            { contract_address: REFERRAL_STORAGE_CONTRACT_ADDRESS },
            positionKey,
            {
              index_token_price: {min:3550,max:3560},
              long_token_price: {min:3550,max:3560},
              short_token_price: {min:1,max:1},
            },
            0,
            0,
            true,
          ) as Promise<{ base_pnl_usd: { mag: bigint; sign: bigint } }>,
        );
      });
      const positionsInfoFromContract = await Promise.all(positionsInfos);

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
        positionsFromContract.flatMap((positionFromContract, index) => {
          if (positionFromContract.collateral_amount === BigInt("0")) {
            return [];
          }
          const positionBasePnl = positionsInfoFromContract[index].base_pnl_usd;
          const multiplicator = positionBasePnl.sign === BigInt("0") ? BigInt(1) : BigInt(-1);

          return [
            {
              ...positionFromContract,
              base_pnl_usd: (
                (multiplicator * positionBasePnl.mag) /
                BigInt(Math.pow(10, 18))
              ).toString(),
              market_price: BigInt(3500),
            },
          ];
        }),
      );
    };

    void fetchPositions();
  }, [address, provider]);

  return { closePosition, positions };
}


