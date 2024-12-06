import { useAccount, useProvider, useReadContract } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { BlockTag, Contract } from "starknet";

import erc_20_abi from "../trade/abi/erc_20.json";

export default function useMarketTokenBalance({
  marketTokenAddress,
  decimal,
}: {
  marketTokenAddress: `0x${string}`;
  decimal: number;
}) {
  const { address } = useAccount();

  const { data: balanceOf } = useReadContract({
    address: marketTokenAddress,
    abi: erc_20_abi.abi,
    enabled: address !== undefined,
    functionName: "balance_of",
    blockIdentifier: BlockTag.PENDING,
    watch: true,
    args: [address],
  });

  const marketTokenBalance = (Number(balanceOf) / 10 ** 6).toFixed(2);
  return { marketTokenBalance };
}
