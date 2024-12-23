"use client";

/* eslint-disable @next/next/no-img-element */
import { Markets } from "@zohal/app/_helpers/markets";
import { getPoolPath } from "@zohal/app/_helpers/routes";
import useMarketTokenBalance from "@zohal/app/_hooks/use-market-token-balance";
import { Tokens } from "@zohal/app/_helpers/tokens";
import { MARKET_TOKEN_CONTRACT_ADDRESS } from "@zohal/app/_lib/addresses";
import { type PropsWithClassName } from "@zohal/app/_lib/utils";
import Button from "@zohal/app/_ui/button";
import clsx from "clsx";
import Link from "next/link";

import usePoolData from "../_hooks/use-pool-data";

const tableHeaderCommonStyles = "pb-4 font-normal";

const IntlFormatter = new Intl.NumberFormat();

function ZohPoolsTableHeader() {
  return (
    <thead className="border-border border-b text-sm">
      <tr className="text-muted-foreground">
        <th className={tableHeaderCommonStyles}>Market</th>
        <th className={tableHeaderCommonStyles}>Price</th>
        {/* <th className={tableHeaderCommonStyles}>Total Supply</th> */}
        <th className={tableHeaderCommonStyles}>Pool Value</th>
        {/* <th className={tableHeaderCommonStyles}>Buyable</th> */}
        <th className={tableHeaderCommonStyles}>Long Token</th>
        <th className={tableHeaderCommonStyles}>Short Token</th>
        <th className={tableHeaderCommonStyles}>Wallet</th>
        {/* <th className={tableHeaderCommonStyles}>APR</th> */}
      </tr>
    </thead>
  );
}

function ZohPoolsTableBody() {
  const { ethPrice, poolData } = usePoolData();

  const { marketTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: MARKET_TOKEN_CONTRACT_ADDRESS,
    decimal: Tokens["ZOH"].decimals
  });

  if (poolData === undefined || marketTokenBalance === undefined) {
    return <div className="mx-auto mt-4">Loading...</div>;
  }

  return (
    <tbody className="text-sm">
      {Object.keys(Markets).map((marketAddress) => {
        return (
          <tr
            className="transition-colors hover:bg-neutral-900"
            key={marketAddress}
          >
            <td className="flex items-center gap-4 px-2 py-3">
              <img
                alt="Ethereum icon"
                className="w-10 rounded-full"
                src="/tokens/ethereum.png"
              />
              <p>ETH/USD</p>
            </td>
            <td className="px-1 py-3">
              ${IntlFormatter.format(Number(ethPrice))}
            </td>
            <td className="px-1 py-3">
              {poolData && (
                <p className="text-muted-foreground">
                  (${IntlFormatter.format(Number(poolData.pool_value))})
                </p>
              )}
            </td>
            <td className="px-1 py-3">
              {poolData && (
                <>
                  <p>
                    {(Number(poolData.long_token_amount) / Math.pow(10, 18) ).toPrecision(1)}{" "}
                    ETH
                  </p>
                  <p className="text-muted-foreground">
                    (${IntlFormatter.format(Number(poolData.long_token_usd))})
                  </p>
                </>
              )}
            </td>
            <td className="px-1 py-3">
              {poolData && (
                <>
                  <p>
                    {IntlFormatter.format(Number(poolData.short_token_amount))}{" "}
                    USDC
                  </p>
                  <p className="text-muted-foreground">
                    (${IntlFormatter.format(Number(poolData.short_token_usd))})
                  </p>
                </>
              )}
            </td>
            <td className="px-1 py-3">
              <p>{marketTokenBalance} ZOH</p>
              {/* <p className="text-muted-foreground">($0.00)</p> */}
            </td>
            {/* <td className="px-2 py-3">14.54%</td> */}
            <td className="px-2 py-3 text-right">
              <Button asChild size="sm" variant="secondary">
                <Link href={getPoolPath(marketAddress)}>Add liquidity</Link>
              </Button>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}

export default function ZohPoolsTable({ className }: PropsWithClassName) {
  return (
    <table className={clsx("w-full text-left", className)}>
      <ZohPoolsTableHeader />
      <ZohPoolsTableBody />
    </table>
  );
}
