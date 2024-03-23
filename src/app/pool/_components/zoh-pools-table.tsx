/* eslint-disable @next/next/no-img-element */
import { Markets } from "@zohal/app/_helpers/markets";
import { getPoolPath } from "@zohal/app/_helpers/routes";
import { type PropsWithClassName } from "@zohal/app/_lib/utils";
import Button from "@zohal/app/_ui/button";
import clsx from "clsx";
import Link from "next/link";

const tableHeaderCommonStyles = "pb-4 font-normal";

function ZohPoolsTableHeader() {
  return (
    <thead className="border-b border-neutral-800 text-sm">
      <tr className="text-[#bcbcbd]">
        <th className={tableHeaderCommonStyles}>Market</th>
        <th className={tableHeaderCommonStyles}>Price</th>
        <th className={tableHeaderCommonStyles}>Total Supply</th>
        <th className={tableHeaderCommonStyles}>Buyable</th>
        <th className={tableHeaderCommonStyles}>Wallet</th>
        <th className={tableHeaderCommonStyles}>APR</th>
      </tr>
    </thead>
  );
}

function ZohPoolsTableBody() {
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
            <td className="px-1 py-3">$3.400</td>
            <td className="px-1 py-3">
              <p>5,623,489.29 ZOH</p>
              <p className="text-[#bcbcbd]">($12,776,103.40)</p>
            </td>
            <td className="px-1 py-3">
              <p>4,656,651 ZOH</p>{" "}
              <p className="text-[#bcbcbd]">($10,586,125)</p>
            </td>
            <td className="px-1 py-3">
              <p>0.00 ZOH</p> <p className="text-[#bcbcbd]">($0.00)</p>
            </td>
            <td className="px-2 py-3">14.54%</td>
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
