import { useAccount, useProvider } from "@starknet-react/core";
import {
  DATA_STORE_CONTRACT_ADDRESS,
  ETH_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  ORACLE_CONTRACT_ADDRESS,
  ORDER_HANDLER_CONTRACT_ADDRESS,
  READER_CONTRACT_ADDRESS,
  REFERRAL_STORAGE_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { useEffect, useState } from "react";
import { CairoCustomEnum, Contract, uint256 } from "starknet";

import reader_abi from "../../pool/_abi/reader_abi.json";
import router_abi from "../abi/router.json";
import oracle_abi from "../abi/oracle.json";
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

    const routerContract = new Contract(
      router_abi.abi,
      ORDER_HANDLER_CONTRACT_ADDRESS,
      provider,
    );

    const orderKey = generateOrderKey(address, MARKET_TOKEN_CONTRACT_ADDRESS, collateral_token);

    const setOrderParams = {
      key: orderKey,
      acceptable_price: uint256.bnToUint256(BigInt("7000")), //TODO: Oracle price
      callback_contract: 0,
      callback_gas_limit: uint256.bnToUint256(0),
      decrease_position_swap_type: new CairoCustomEnum({ NoSwap: {} }),
      execution_fee: uint256.bnToUint256(0),
      initial_collateral_delta_amount: uint256.bnToUint256(BigInt("1000000000000000000")),
      initial_collateral_token: collateral_token,
      is_long: new CairoCustomEnum({ True: {} }), // Adjust as needed
      market: MARKET_TOKEN_CONTRACT_ADDRESS,
      min_output_amount: uint256.bnToUint256(BigInt("7000000000000000000000")), //TODO: Oracle price * input
      order_type: new CairoCustomEnum({ MarketDecrease: {} }),
      receiver: address,
      referral_code: 0,
      size_delta_usd: uint256.bnToUint256(BigInt("7000000000000000000000")), //TODO: Oracle price * input
      swap_path: [MARKET_TOKEN_CONTRACT_ADDRESS],
      trigger_price: uint256.bnToUint256(BigInt("7000")), // TODO: Oracle price
      ui_fee_receiver: 0,
      updated_at_block: BigInt(await provider.getBlockNumber()), // Await here
      is_frozen: new CairoCustomEnum({ False: {} })
    };

    const setOrderCall = routerContract.populate("set_order", [
      orderKey,
      setOrderParams,
    ]);

    await account.execute(setOrderCall); // Await here
  }

  useEffect(() => {
    const fetchPositions = async () => {
      if (address === undefined) {
        return;
      }
      setPositions(undefined);
      const dataStoreContract = new Contract(
        datastore_abi,
        DATA_STORE_CONTRACT_ADDRESS,
        provider,
      );
      const positionKeys = (await dataStoreContract.functions.get_account_position_keys(
        address,
        0,
        10,
      )) as Array<bigint>;

      const oracleContract = new Contract(
        oracle_abi,
        ORACLE_CONTRACT_ADDRESS,
        provider,
      );
      const oracleEthPrice = (await oracleContract.functions.get_primary_price(
        ETH_CONTRACT_ADDRESS,
      )) as { max: bigint; min: bigint };

      const oracleUsdcPrice = (await oracleContract.functions.get_primary_price(
        USDC_CONTRACT_ADDRESS,
      )) as { max: bigint; min: bigint };

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
              index_token_price: oracleEthPrice,
              long_tokenPrice: oracleEthPrice,
              short_token_price: oracleUsdcPrice,
            },
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
              market_price: oracleEthPrice.min,
            },
          ];
        }),
      );
    };

    void fetchPositions();
  }, [address, provider]);

  return { closePosition, positions };
}

function generateOrderKey(account, market, token) {
  // Implement a function to generate a unique order key based on the account, market, and token.
  // This is just a placeholder and should be implemented based on your application's logic.
  return `0x${BigInt(account).toString(16)}${BigInt(market).toString(16)}${BigInt(token).toString(16)}`;
}
