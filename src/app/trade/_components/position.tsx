"use client";

import { Tokens } from "@zohal/app/_helpers/tokens";
import { cn, type PropsWithClassName } from "@zohal/app/_lib/utils";
import clsx from "clsx";

import useUserPosition from "../_hooks/use-user-position";
import useEthPrice, { usePriceDataSubscription } from "../_hooks/use-market-data";
import EditMarketPositionDialog from "./edit-market-position-dialog";
import EditLimitPositionDialog from "./edit-limit-position-dialog";
import EditCollateralPositionDialog from "./edit-collateral-position-dialog";
import useCloseAllPositions from "../_hooks/use-close-all-positions";
import useUserPositionInfos from "../_hooks/use-user-position-infos";
import useFormatNumber from "../_hooks/use-format-number";

/* eslint-disable @next/next/no-img-element */
export default function Position({ className }: PropsWithClassName) {
  // TODO @YohanTz: Add ? icon to explain each of the table header
  const { positions } = useUserPosition();
  const { tokenData: ethData } = usePriceDataSubscription({ pairSymbol: "ETH/USD" });
  const { tokenData: btcData } = usePriceDataSubscription({ pairSymbol: "BTC/USD" });
  const { tokenData: strkData } = usePriceDataSubscription({ pairSymbol: "STRK/USD" });
  const { closeAllPositions } = useCloseAllPositions();
  const { getPositionInfos } = useUserPositionInfos();
  const { formatNumberWithoutExponent } = useFormatNumber();

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
        <thead className="border-b border-border text-left">
          <tr className="text-muted-foreground">
            <th className={tableHeaderCommonStyles}>Position</th>
            <th className={tableHeaderCommonStyles}>P&L</th>
            <th className={tableHeaderCommonStyles}>Size</th>
            <th className={tableHeaderCommonStyles}>Collateral</th>
            <th className={tableHeaderCommonStyles}>Entry Price</th>
            <th className={tableHeaderCommonStyles}>Liq Price</th>
            <th className={tableHeaderCommonStyles}>Market Price</th>
            <th className={cn("text-end", tableHeaderCommonStyles)}>
              <button 
                className="rounded-lg border border-border bg-secondary px-1 hover:bg-gray-800"
                onClick={() => closeAllPositions(positions)}>
                Close all positions
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position, index) => {
            const positionInfos = getPositionInfos(position);
            return (
              <tr
                className="border-b border-border text-sm"
                key={position.key || index}
              >
                <td className="flex gap-4 py-1">
                  <div className="flex-shrink-0 rounded-full border border-border p-1">
                    <img
                      alt={`${positionInfos.collateral_symbol} icon`}
                      className="w-8 rounded-full"
                      src={Tokens[positionInfos.collateral_symbol].icon}
                    />
                  </div>
                  <div>
                    {positionInfos.collateral_symbol}-USD
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
                      {positionInfos.leverage}×
                    </span>
                  </div>
                </td>
                <td>
                  <div className={clsx(
                        positionInfos.pnl > 0
                          ? "text-sm text-[#40B68B]"
                          : "text-sm text-[#FF5354]",
                      )}>
                    {positionInfos.pnl > 0 ? "+" : ""}
                      {formatNumberWithoutExponent(Number(positionInfos.pnl.toFixed(2)))}
                    <br />
                  </div>
                </td>
                <td className="pr-6">
                  ${formatNumberWithoutExponent(Number(positionInfos.size_in_usd))}
                </td>
                <td className="h-full align-middle">
                  <div className="flex items-center gap-2">
                    <span>{formatNumberWithoutExponent(Number(positionInfos.collateral_amount))} USDC</span>
                    <EditCollateralPositionDialog position={position} />
                  </div>
                </td>
                <td>
                  ${formatNumberWithoutExponent(Number(positionInfos.entry_price))}
                </td>
                <td>
                  ${formatNumberWithoutExponent(Number(positionInfos.liq_price))}
                </td>
                <td>
                  {positionInfos.collateral_symbol === "ETH" ? (
                    `$${formatNumberWithoutExponent(Number(ethData.currentPrice.toFixed(2)))}`
                  ) : positionInfos.collateral_symbol === "BTC" ? (
                    `$${formatNumberWithoutExponent(Number(btcData.currentPrice.toFixed(2)))}`
                  ) : (
                    `$${formatNumberWithoutExponent(Number(strkData.currentPrice.toFixed(2)))}`
                  )}
                </td>
                <td className="text-right pr-2">
                  <EditLimitPositionDialog position={position} />
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

const tableHeaderCommonStyles = "pb-1 pr-2 font-normal";
