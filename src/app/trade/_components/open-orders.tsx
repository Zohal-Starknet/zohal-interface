"use client";

import { Tokens } from "@zohal/app/_helpers/tokens";
import { cn, type PropsWithClassName } from "@zohal/app/_lib/utils";
import clsx from "clsx";

import  {
  
  usePrices,
} from "../_hooks/use-market-data";
import {
  BTC_MARKET_TOKEN_CONTRACT_ADDRESS,
  ETH_MARKET_TOKEN_CONTRACT_ADDRESS,
  STRK_MARKET_TOKEN_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import useUserOrder, { defaultOrder } from "../_hooks/use-user-order";
import isEqual from "lodash.isequal";
import EditOrder from "./edit-order";
import useFormatNumber from "../_hooks/use-format-number";
import useGetOrder from "../_hooks/use-get-order";
import { useState } from "react";
import CancelOrder from "./cancel-order";

/* eslint-disable @next/next/no-img-element */
export default function OpenOrders({ className }: PropsWithClassName) {
  // TODO @YohanTz: Add ? icon to explain each of the table header
  const { orders } = useGetOrder();
  // const { tokenData: ethData } = usePriceDataSubscription({
  //   pairSymbol: "ETH/USD",
  // });
  // const { tokenData: btcData } = usePriceDataSubscription({
  //   pairSymbol: "BTC/USD",
  // });
  // const { tokenData: strkData } = usePriceDataSubscription({
  //   pairSymbol: "STRK/USD",
  // });
  const { prices } = usePrices();
  const ethData = prices["ETH/USD"];
  const btcData = prices["BTC/USD"];
  const strkData = prices["STRK/USD"];
  const { formatNumberWithoutExponent } = useFormatNumber();

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
            <th className={tableHeaderCommonStyles}>Size Delta</th>
            <th className={tableHeaderCommonStyles}>Collateral Delta</th>
            <th className={tableHeaderCommonStyles}>Acceptable Price</th>
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
            let orderType = "";
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
            const collateralAmountBigInt = BigInt(
              order.initial_collateral_delta_amount,
            );
            const usdAmount = Number(collateralAmountBigInt) / Number(decimals);
            const formattedUsdAmount = usdAmount.toFixed(2).toString();

            const sizeInUsd =
              Number(order.size_delta_usd) / 10 ** 16 / Number(10 ** 18);
            const formattedSizeInUsd = sizeInUsd.toFixed(2).toString();

            const orderLeverage =
              Number(order.size_delta_usd) /
              10 ** 16 /
              (Number(order.initial_collateral_delta_amount) * 10 ** 12);
            const triggerPrice = Number(BigInt(order.trigger_price)) / divisor;
            const acceptablePrice =
              Number(BigInt(order.acceptable_price)) / divisor;

            const nonUndefinedKey = Object.entries(
              order.order_type.variant,
            ).find(([key, value]) => value !== undefined)?.[0];

            if (isEqual(nonUndefinedKey, "LimitDecrease")) {
              orderType = "Take Profit";
            } else if (isEqual(nonUndefinedKey, "LimitIncrease")) {
              orderType = "Limit Increase";
            } else if (isEqual(nonUndefinedKey, "StopLossDecrease")) {
              orderType = "Stop Loss";
            } else if (isEqual(nonUndefinedKey, "MarketIncrease")) {
              orderType = "Market Increase";
            }

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
                      {usdAmount === 0 || sizeInUsd === 0
                        ? "-"
                        : orderLeverage.toFixed(2) + "×"}
                    </span>
                  </div>
                </td>
                <td className="pr-6">
                  ${formatNumberWithoutExponent(Number(formattedSizeInUsd))}
                </td>
                <td className="h-full align-middle">
                  <div className="flex items-center gap-2">
                    <span>
                      {formatNumberWithoutExponent(Number(formattedUsdAmount))}{" "}
                      USDC
                    </span>
                  </div>
                </td>
                <td>
                  $
                  {formatNumberWithoutExponent(
                    Number(acceptablePrice.toFixed(2)),
                  )}
                </td>
                <td>
                  $
                  {formatNumberWithoutExponent(Number(triggerPrice.toFixed(2)))}
                </td>
                <td>
                  <div>
                    <span
                      className={clsx(
                        "rounded-sm px-1 py-0.5 text-xs font-semibold text-background",
                        orderType.includes("Increase")
                          ? "bg-[#40B68B]"
                          : "bg-[#FF5354]",
                      )}
                    >
                      {orderType}
                    </span>
                  </div>
                </td>
                <td className="pr-2 text-right">
                  <EditOrder
                    order={order}
                    old_size_delta={formattedSizeInUsd}
                    old_trigger_price={triggerPrice.toFixed(2)}
                  />
                  <CancelOrder
                    order={order}
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

const tableHeaderCommonStyles = "pb-1 pr-2 font-normal";
