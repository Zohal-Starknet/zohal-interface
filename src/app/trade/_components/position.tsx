"use client";

import { Tokens } from "@zohal/app/_helpers/tokens";
import { cn, type PropsWithClassName } from "@zohal/app/_lib/utils";
import clsx from "clsx";

import useUserPosition from "../_hooks/use-user-position";
import useEthPrice from "../_hooks/use-market-data";
import ClosePositionDialog from "./decrease-position-dialog";
import { DropdownMenu } from "@zohal/app/_ui/dropdown-menu";
import EditMarketPositionDialog from "./edit-market-position-dialog";

/* eslint-disable @next/next/no-img-element */
export default function Position({ className }: PropsWithClassName) {
  // TODO @YohanTz: Add ? icon to explain each of the table header
  const { closePosition, positions } = useUserPosition();
  const { ethData } = useEthPrice();

  if (positions === undefined) {
    return (
      <div className="mt-4 flex justify-center text-neutral-400">
        No Positions
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
        <thead className="border-b border-border text-left">
          <tr className="text-muted-foreground">
            <th className={tableHeaderCommonStyles}>Position</th>
            <th className={tableHeaderCommonStyles}>P&L</th>
            <th className={tableHeaderCommonStyles}>Size</th>
            <th className={tableHeaderCommonStyles}>Collateral</th>
            <th className={tableHeaderCommonStyles}>Entry Price</th>
            <th className={tableHeaderCommonStyles}>Market Price</th>
            <th className={cn("text-end", tableHeaderCommonStyles)}>
              Close by
            </th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position, index) => {
            const decimals = BigInt(10 ** 18);
            const collateralAmountBigInt = BigInt(position.collateral_amount);
            const ethAmount = Number(collateralAmountBigInt) / Number(decimals);
            const formattedEthAmount = ethAmount.toFixed(4).toString();

            const sizeInUsd = (Number(position.size_in_usd)/10**16) / Number(decimals);
            const formattedSizeInUsd = sizeInUsd.toFixed(2).toString();

            const positionLeverage =
              (Number(position.size_in_usd) / 10**16) /
              (Number(position.collateral_amount) *
                Number(position.market_price));

            return (
              <tr
                className="border-b border-border text-sm"
                key={position.key || index}
              >
                <td className="flex gap-4 py-4">
                  <div className="flex-shrink-0 rounded-full border border-border p-1">
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
                        "ml-4 rounded-sm px-1 py-0.5 text-xs font-semibold text-background",
                        position.is_long ? "bg-[#40B68B]" : "bg-[#FF5354]",
                      )}
                    >
                      {position.is_long ? "LONG" : "SHORT"}
                    </span>
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {positionLeverage.toFixed(2)}×
                    </span>
                  </div>
                </td>
                <td>
                  <div className={clsx(
                        position.base_pnl_usd > 0
                          ? "text-sm text-[#40B68B]"
                          : "text-sm text-[#FF5354]",
                      )}>
                    $
                    {position.base_pnl_usd > 0 ? "+" : ""}
                      {(Number((BigInt(position.base_pnl_usd)/ decimals).toString()) / 10**16).toFixed(2)}$
                    <br />
                  </div>
                </td>
                <td className="pr-6">
                  ${formattedSizeInUsd.toString()}
                </td>
                <td>
                  {formattedEthAmount.toString()} ETH
                  <br />
                </td>
                <td>
                  {(
                    Number((BigInt(position.size_in_usd) /  BigInt(position.collateral_amount)) / BigInt(10**16))).toFixed(2).toString()}
                </td>
                <td>${ethData.currentPrice.toFixed(2)}</td>
                <td className="text-right">
                  <EditMarketPositionDialog position={position} />
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
