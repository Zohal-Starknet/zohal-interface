import { useProvider } from "@starknet-react/core";
import {
  DATA_STORE_CONTRACT_ADDRESS,
  ETH_CONTRACT_ADDRESS,
  MARKET_TOKEN_CONTRACT_ADDRESS,
  READER_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import { useEffect, useState } from "react";
import { Contract } from "starknet";

import reader_abi from "../_abi/reader_abi.json";
import { usePrices } from "@zohal/app/trade/_hooks/use-market-data";

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

export default function usePoolData() {
  const { provider } = useProvider();
  const [poolData, setPoolData] = useState<PoolData | undefined>(undefined);
  const { prices } = usePrices();
  const ethData = prices["ETH/USD"];

  useEffect(() => {
    const fetchPoolData = async () => {
      const readerContract = new Contract(
        reader_abi.abi,
        READER_CONTRACT_ADDRESS,
        provider,
      );

      const ethPrice = parseFloat(ethData.currentPrice.toPrecision(4));

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
          { min: ethPrice, max: ethPrice },
          // long_token_price
          { min: ethPrice, max: ethPrice },
          // short_token_price
          { min: 1, max: 1 },
          // pnl_factor_type
          "0x4896bc14d7c67b49131baf26724d3f29032ddd7539a3a8d88324140ea2de9b4",
          // maximize
          false,
        )) as [unknown, PoolData];

      const poolData = tokenPriceResponse[1];
      const decimalsETH = BigInt(Math.pow(10, 18));
      const decimalsUSDC = BigInt(Math.pow(10, 6));

      setPoolData({
        ...poolData,
        long_token_amount: (BigInt(poolData.long_token_amount)).toString(),
        long_token_usd: (BigInt(poolData.long_token_usd) / decimalsETH).toString(),
        //@ts-ignore
        pool_value: ((BigInt(poolData.pool_value.mag) / decimalsETH) + BigInt(poolData.short_token_usd) / decimalsUSDC ).toString(),
        short_token_amount: (BigInt(poolData.short_token_amount) / decimalsUSDC).toString(),
        short_token_usd: (BigInt(poolData.short_token_usd) / decimalsUSDC).toString(),
      });
    };

    fetchPoolData();
  }, [provider, ethData.currentPrice]);

  return { ethPrice: ethData.currentPrice.toPrecision(4), poolData };
}
