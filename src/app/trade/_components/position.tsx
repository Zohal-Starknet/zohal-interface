"use client";

import { Tokens } from "@zohal/app/_helpers/tokens";
import { type PropsWithClassName } from "@zohal/app/_lib/utils";
import clsx from "clsx";
import { validateAndParseAddress } from "starknet";

import useUserPosition from "../_hooks/use-user-position";

/* eslint-disable @next/next/no-img-element */
export default function Position({ className }: PropsWithClassName) {
  // TODO @YohanTz: Add ? icon to explain each of the table header
  const { closePosition, positions } = useUserPosition();

  if (positions === undefined) {
    return (
      <div className="mt-4 flex justify-center text-neutral-400">
        Loading...
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="mt-4 flex justify-center text-neutral-400">
        No Positions
      </div>
    );
  }

  return (
    <div className={clsx("w-full", className)}>
      <table className="w-full">
        <thead className="border-b border-neutral-800 text-left">
          <tr className="text-[#bcbcbd]">
            <th className={tableHeaderCommonStyles}>Position</th>
            {/* <th className={tableHeaderCommonStyles}>Net Value</th> */}
            <th className={tableHeaderCommonStyles}>Size</th>
            <th className={tableHeaderCommonStyles}>Collateral</th>
            <th className={tableHeaderCommonStyles}>Entry Price</th>
            <th className={tableHeaderCommonStyles}>Market Price</th>
            {/* <th className={tableHeaderCommonStyles}>Liquidation Price</th> */}
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => {
            return (
              <tr
                className="border-b border-neutral-800 text-sm"
                key={position.key}
              >
                <td className="flex gap-4 py-4">
                  <div className="flex-shrink-0 rounded-full border border-neutral-600 p-1">
                    <img
                      alt={`Ethereum icon`}
                      className="w-8 rounded-full"
                      src={Tokens.ETH.icon}
                    />
                  </div>
                  <div>
                    ETH-USD
                    <span
                      className={clsx(
                        "ml-4 rounded-sm px-1 py-0.5 text-xs font-semibold text-black",
                        position.is_long ? "bg-[#40B68B]" : "bg-[#FF5354]",
                      )}
                    >
                      {position.is_long ? "LONG" : "SHORT"}
                    </span>
                    <br />
                    <span className="text-sm text-[#bcbcbd]">1×</span>
                  </div>
                </td>
                {/* <td className="py-4">
                  {data.netValue.price}
                  <br />
                  <span
                    className={clsx(
                      "text-sm",
                      position.is_long ? "text-[#40B68B]" : "text-[#FF5354]",
                    )}
                  >
                    {data.netValue.purcentage}
                  </span>
                </td> */}
                <td className="pr-6">
                  $
                  {(
                    (position.market_price * position.collateral_amount) /
                    10n ** 18n
                  ).toString()}
                </td>
                <td>
                  {(position.collateral_amount / 10n ** 18n).toString()} ETH
                  <br />
                </td>
                <td>$5000</td>
                <td>${position.market_price.toString()}</td>
                {/* <td>{data.liquidationPrice}</td> */}
                <td className="text-right">
                  <button
                    className="rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2"
                    onClick={() => closePosition(position.collateral_token)}
                  >
                    Close
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderCommonStyles = "pb-4 font-normal";

const tableData = [
  {
    collateral: { dollar: "$48.35", token: "48 USDC" },
    entryPrice: "$1581.35",
    leverage: "20.00×",
    liquidationPrice: "$1581.35",
    markPrice: "$1581.35",
    netValue: { price: "$2.38", purcentage: "(+$0.03 / +1.26%)" },
    position: "ETH-USD",
    positionType: "short",
    size: "$48.35",
    token: Tokens.ETH,
  },
  {
    collateral: { dollar: "$18.35", token: "18 USDC" },
    entryPrice: "$2581.35",
    leverage: "10.00×",
    liquidationPrice: "$2581.35",
    markPrice: "$2581.35",
    netValue: { price: "$2.38", purcentage: "(-$0.03 / -1.26%)" },
    position: "BTC-USD",
    positionType: "long",
    size: "$18.35",
    token: Tokens.WBTC,
  },
  {
    collateral: { dollar: "$48.35", token: "48 USDC" },
    entryPrice: "$1581.35",
    leverage: "2.00×",
    liquidationPrice: "$1581.35",
    markPrice: "$1581.35",
    netValue: { price: "$2.38", purcentage: "(+$10.03 / -5.26%)" },
    position: "ETH-USD",
    positionType: "short",
    size: "$48.35",
    token: Tokens.ETH,
  },
];
