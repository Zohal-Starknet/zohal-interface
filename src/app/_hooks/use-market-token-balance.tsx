import { useAccount, useProvider } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Contract } from "starknet";

import erc_20_abi from "../trade/abi/erc_20.json";

export default function useMarketTokenBalance({
  marketTokenAddress, decimal
}: {
  marketTokenAddress: string;
  decimal: number
}) {
  const { address } = useAccount();
  const { provider } = useProvider();
  const [marketTokenBalance, setMarketTokenBalance] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const fetchBalance = async () => {
      if (address === undefined) {
        setMarketTokenBalance("0");
        return;
      }

      const marketTokenContract = new Contract(
        erc_20_abi.abi,
        marketTokenAddress,
        provider,
      );

      const balanceOf = (await marketTokenContract.functions.balance_of(
        address,
      )) as bigint;

      setMarketTokenBalance(
        new Intl.NumberFormat().format(Math.floor((Number(balanceOf) / 10 ** decimal))),
      );
    };

    void fetchBalance();
  }, [address, marketTokenAddress, provider]);

  return { marketTokenBalance };
}
