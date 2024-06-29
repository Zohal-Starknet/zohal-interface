import { useProvider } from "@starknet-react/core";
import {
  DATA_STORE_CONTRACT_ADDRESS,
  ETH_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  ORACLE_CONTRACT_ADDRESS,
  READER_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { useEffect, useState } from "react";
import { Contract } from "starknet";

import reader_abi from "../_abi/reader_abi.json";

type PoolData = {
  borrowing_fee_pool_factor: bigint;
  impact_pool_amount: bigint;
  long_pnl: { mag: bigint; sign: boolean };
  long_token_amount: string;
  long_token_usd: string;
  net_pnl: { mag: bigint; sign: boolean };
  pool_value: string;
  short_pnl: { mag: bigint; sign: boolean };
  short_token_amount: string;
  short_token_usd: string;
  total_borrowing_fees: bigint;
};

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

export default function usePoolData() {
  const { provider } = useProvider();
  const [poolData, setPoolData] = useState<PoolData | undefined>(undefined);
  const [ethPrice, setEthPrice] = useState("");

  useEffect(() => {
    const fetchPoolData = async () => {
      const oracleContract = new Contract(
        oracleAbi,
        ORACLE_CONTRACT_ADDRESS,
        provider,
      );

      const oracleEthPrice = (await oracleContract.functions.get_primary_price(
        ETH_CONTRACT_ADDRESS,
      )) as { max: bigint; min: bigint };

      setEthPrice(oracleEthPrice.min.toString());

      const oracleUsdcPrice = (await oracleContract.functions.get_primary_price(
        USDC_CONTRACT_ADDRESS,
      )) as { max: bigint; min: bigint };

      const readerContract = new Contract(
        reader_abi.abi,
        READER_CONTRACT_ADDRESS,
        provider,
      );

      const tokenPriceResponse =
        (await readerContract.functions.get_market_token_price(
          // data_store
          { contract_address: DATA_STORE_CONTRACT_ADDRESS },
          // market
          {
            index_token: ETH_CONTRACT_ADDRESS,
            long_token: ETH_CONTRACT_ADDRESS,
            market_token: MARKET_TOKEN_CONTRACT_ADDRESS,
            short_token: USDC_CONTRACT_ADDRESS,
          },
          // index_token_price
          oracleEthPrice,
          // long_token_price
          oracleEthPrice,
          // short_token_price
          oracleUsdcPrice,
          // pnl_factor_type
          "0x4896bc14d7c67b49131baf26724d3f29032ddd7539a3a8d88324140ea2de9b4",
          // maximize
          false,
        )) as [unknown, PoolData];

      const poolData = tokenPriceResponse[1];
      const decimals = BigInt(Math.pow(10, 18));

      setPoolData({
        ...poolData,
        long_token_amount: (BigInt(poolData.long_token_amount) / decimals).toString(),
        long_token_usd: (BigInt(poolData.long_token_usd) / decimals).toString(),
        pool_value: (BigInt(poolData.pool_value) / decimals).toString(),
        short_token_amount: (
          BigInt(poolData.short_token_amount) /
          decimals
        ).toString(),
        short_token_usd: (BigInt(poolData.short_token_usd) / decimals).toString(),
      });
    };

    void fetchPoolData();
  }, [provider]);

  return { ethPrice, poolData };
}
