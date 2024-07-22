import { useAccount, useProvider } from "@starknet-react/core";
import {
  DATA_STORE_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  READER_CONTRACT_ADDRESS,
  REFERRAL_STORAGE_CONTRACT_ADDRESS,
  EXCHANGE_ROUTER_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { useEffect, useState } from "react";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import reader_abi from "../../pool/_abi/reader_abi.json";
import exchange_router_abi from "../abi/exchange_router.json";
import datastore_abi from "../abi/datastore.json";
import useEthPrice from "./use-market-data";

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
  const { ethData } = useEthPrice();
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const [positions, setPositions] = useState<
    | Array<Position & { base_pnl_usd: bigint } & { market_price: number }>
    | undefined
  >(undefined);

  async function closePosition(
    position: Position,
    collateral_token: bigint,
    collateral_amount: bigint,
  ) {
    if (account === undefined || address === undefined) {
      return;
    }

    const createOrderParams = {
      receiver: address,
      callback_contract: 0,
      ui_fee_receiver: 0,
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      initial_collateral_token: collateral_token,
      swap_path: [],
      size_delta_usd: uint256.bnToUint256(position.size_in_usd),
      initial_collateral_delta_amount: uint256.bnToUint256(
        BigInt(collateral_amount),
      ),
      trigger_price: uint256.bnToUint256(0),
      acceptable_price: position.is_long
        ? uint256.bnToUint256(BigInt(3000))
        : uint256.bnToUint256(BigInt(5000)),
      execution_fee: uint256.bnToUint256(0),
      callback_gas_limit: uint256.bnToUint256(0),
      min_output_amount: uint256.bnToUint256(BigInt(0)),
      order_type: new CairoCustomEnum({ MarketDecrease: {} }),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      is_long: position.is_long ? true : false,
      referral_code: "0x0",
    };

    const exchangeRouterContract = new Contract(
      exchange_router_abi.abi,
      EXCHANGE_ROUTER_CONTRACT_ADDRESS,
      provider,
    );

    const createOrderCall = exchangeRouterContract.populate("create_order", [
      createOrderParams,
    ]);

    await account.execute(createOrderCall);
  }

  useEffect(() => {
    const fetchPositions = async () => {
      if (address === undefined || ethData.currentPrice === 0) {
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
        Promise<{ base_pnl_usd: { mag: bigint; sign: Boolean } }>
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
              index_token_price: {
                min: parseInt("" + ethData.currentPrice),
                max: parseInt("" + ethData.currentPrice),
              },
              long_token_price: {
                min: parseInt("" + ethData.currentPrice),
                max: parseInt("" + ethData.currentPrice),
              },
              short_token_price: { min: 1, max: 1 },
            },
            0,
            0,
            true,
          ) as Promise<{ base_pnl_usd: { mag: bigint; sign: Boolean } }>,
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
          const multiplicator =
            positionBasePnl.sign === false ? BigInt(1) : BigInt(-1);

          return [
            {
              ...positionFromContract,
              base_pnl_usd: multiplicator * positionBasePnl.mag,
              market_price: parseInt(ethData.currentPrice.toFixed(0)),
            },
          ];
        }),
      );
    };

    void fetchPositions();
  }, [address, provider, ethData]);

  return { closePosition, positions };
}
