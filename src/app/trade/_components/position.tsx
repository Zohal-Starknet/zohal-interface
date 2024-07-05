"use client";

import { Tokens } from "@zohal/app/_helpers/tokens";
import { type PropsWithClassName } from "@zohal/app/_lib/utils";
import clsx from "clsx";

import useUserPosition from "../_hooks/use-user-position";
import ClosePositionDialog from "./close-position-dialog";
import useEthPrice  from "../_hooks/use-market-data";

/* eslint-disable @next/next/no-img-element */
export default function Position({ className }: PropsWithClassName) {
  // TODO @YohanTz: Add ? icon to explain each of the table header
  const { closePosition, positions } = useUserPosition();
  const {ethData} = useEthPrice();

  if (positions === undefined) {
    return (
      <div className="mt-4 flex justify-center text-neutral-400">
        Connect your wallet to see your positions
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
            <th className={tableHeaderCommonStyles}>Net Value</th>
            <th className={tableHeaderCommonStyles}>Size</th>
            <th className={tableHeaderCommonStyles}>Collateral</th>
            <th className={tableHeaderCommonStyles}>Entry Price</th>
            <th className={tableHeaderCommonStyles}>Market Price</th>
            {/* <th className={tableHeaderCommonStyles}>Liquidation Price</th> */}
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => {
            const decimals = BigInt(Math.pow(10, 18));
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
                    <span className="text-sm text-[#bcbcbd]">{(position.size_in_usd / (BigInt(3500) * BigInt(position.collateral_amount))).toString()}×</span>
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
                <td>
                  <div>
                    ${((position.size_in_usd + BigInt(position.base_pnl_usd)) / decimals).toString()}
                    <br />
                    <span className={clsx(position.base_pnl_usd > 0 ? "text-sm text-[#40B68B]" : "text-sm text-[#FF5354]")}>
                    {position.base_pnl_usd>0 ? '+':''}{(position.base_pnl_usd / decimals).toString()}$</span>
                  </div>
                </td> 
                <td className="pr-6">
                  $
                  {(
                    position.size_in_usd / decimals
                  ).toString()}
                </td>
                <td>
                  {(BigInt(position.collateral_amount) / decimals).toString()} ETH
                  <br />
                </td>
                <td>{(position.base_pnl_usd).toString()}</td>
                <td>${(ethData.currentPrice.toFixed(2))}</td>
                {/* <td>{data.liquidationPrice}</td> */}
                <td className="text-right">
                  <ClosePositionDialog
                    collateral_amount={position.collateral_amount}
                    collateral_token={position.collateral_token}
                  />
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
