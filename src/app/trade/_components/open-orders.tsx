"use client";

import { Tokens } from "@zohal/app/_helpers/tokens";
import { cn, type PropsWithClassName } from "@zohal/app/_lib/utils";
import clsx from "clsx";

import useEthPrice from "../_hooks/use-market-data";
import {
  BTC_MARKET_TOKEN_CONTRACT_ADDRESS,
  ETH_MARKET_TOKEN_CONTRACT_ADDRESS,
  STRK_MARKET_TOKEN_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import useBtcPrice from "../_hooks/use-market-data-btc";
import useStrkPrice from "../_hooks/use-market-data-strk";
import useUserOrder from "../_hooks/use-user-order";
import EditLimitPositionDialog from "./edit-limit-position-dialog";
import EditMarketPositionDialog from "./edit-market-position-dialog";

/* eslint-disable @next/next/no-img-element */
export default function OpenOrders({ className }: PropsWithClassName) {
  // TODO @YohanTz: Add ? icon to explain each of the table header
  const { orders } = useUserOrder();
  const { ethData } = useEthPrice();
  const { btcData } = useBtcPrice();
  const { strkData } = useStrkPrice();

  if (orders === undefined) {
    return (
      <div className="mt-4 flex justify-center text-neutral-400">No orders</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mt-4 flex justify-center text-neutral-400">No orders</div>
    );
  }

  return (
    <div className={clsx("w-full", className)}>
      <table className="w-full">
        <thead className="border-b border-border text-left">
          <tr className="text-muted-foreground">
            <th className={tableHeaderCommonStyles}>Order</th>
            <th className={tableHeaderCommonStyles}>Size</th>
            <th className={tableHeaderCommonStyles}>Collateral</th>
            <th className={tableHeaderCommonStyles}>Trigger Price</th>
            <th className={tableHeaderCommonStyles}>Order Type</th>
            <th className={cn("mr-2 text-end", tableHeaderCommonStyles)}>
              Manage Order
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            let collateral_symbol = "ETH";
            let multiplicator = 10 ** 12;
            let divisor = 10 ** 16;
            let tradedPriceData = ethData;
            const pragma_decimals = 8;
            if (order.market == ETH_MARKET_TOKEN_CONTRACT_ADDRESS) {
              collateral_symbol = "ETH";
            }
            if (order.market == BTC_MARKET_TOKEN_CONTRACT_ADDRESS) {
              collateral_symbol = "BTC";
              divisor = 10 ** 26;
              multiplicator = 10 ** 2;
              tradedPriceData = btcData;
            }
            if (order.market == STRK_MARKET_TOKEN_CONTRACT_ADDRESS) {
              collateral_symbol = "STRK";
              tradedPriceData = strkData;
            }

            const decimals = BigInt(10 ** 6);
            const collateralAmountBigInt = BigInt(order.collateral_amount);
            const usdAmount = Number(collateralAmountBigInt) / Number(decimals);
            const formattedUsdAmount = usdAmount.toFixed(2).toString();

            const sizeInUsd =
              Number(order.size_in_usd) / 10 ** 16 / Number(10 ** 18);
            const formattedSizeInUsd = sizeInUsd.toFixed(2).toString();

            const orderLeverage =
              Number(order.size_in_usd) /
              10 ** 16 /
              (Number(order.collateral_amount) * 10 ** 12);
            const entryPrice =
              Number(BigInt(order.size_in_usd) / BigInt(order.size_in_tokens)) /
              divisor;

            return (
              <tr
                className="border-b border-border text-sm"
                key={order.key || index}
              >
                <td className="flex gap-4 py-1">
                  <div className="flex-shrink-0 rounded-full border border-border p-1">
                    <img
                      alt={`${collateral_symbol} icon`}
                      className="w-8 rounded-full"
                      src={Tokens[collateral_symbol].icon}
                    />
                  </div>
                  <div>
                    {collateral_symbol}-USD
                    <span
                      className={clsx(
                        "ml-4 rounded-sm px-1 py-0.5 text-xs font-semibold text-background",
                        order.is_long ? "bg-[#40B68B]" : "bg-[#FF5354]",
                      )}
                    >
                      {order.is_long ? "LONG" : "SHORT"}
                    </span>
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {orderLeverage.toFixed(2)}×
                    </span>
                  </div>
                </td>
                <td className="pr-6">${formattedSizeInUsd.toString()}</td>
                <td className="h-full align-middle">
                  <div className="flex items-center gap-2">
                    <span>{formattedUsdAmount.toString()} USDC</span>
                  </div>
                </td>
                <td>${entryPrice.toFixed(2).toString()}</td>
                <td>
                  <div>
                    <span
                      className={clsx(
                        "rounded-sm px-1 py-0.5 text-xs font-semibold text-background",
                        order.is_long ? "bg-[#40B68B]" : "bg-[#FF5354]",
                      )}
                    >
                      {order.is_long ? "Limit Increase" : "Limit Decrease"}
                    </span>
                  </div>
                </td>
                <td className="pr-2 text-right">
                  <button className="mr-1 rounded-lg border border-border bg-secondary px-3 py-2 hover:bg-gray-800">
                    Edit Order
                  </button>
                  <button className="rounded-lg border border-border bg-secondary px-3 py-2 hover:bg-gray-800">
                    Cancel Order
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

const tableHeaderCommonStyles = "pb-1 pr-2 font-normal";
