/* eslint-disable @next/next/no-img-element */
"use client";

import { Tokens } from "@zohal/app/_helpers/tokens";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@zohal/app/_ui/Modal";
import Input from "@zohal/app/_ui/input";
import { useState, useEffect } from "react";

import useUserPosition, { Position } from "../_hooks/use-user-position";
import {
  BTC_MARKET_TOKEN_CONTRACT_ADDRESS,
  ETH_MARKET_TOKEN_CONTRACT_ADDRESS,
  STRK_MARKET_TOKEN_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import PriceInfo from "./price-info";
import useEthPrice, { PriceData } from "../_hooks/use-market-data";
import useBtcPrice from "../_hooks/use-market-data-btc";
import useStrkPrice from "../_hooks/use-market-data-strk";
import useFormatNumber from "../_hooks/use-format-number";
import useUserPositionInfos from "../_hooks/use-user-position-infos";
import PriceInfoEditPosition from "./price-info-edit-position";

interface ClosePositionDialogProps {
  position: Position;
  collateral_amount: bigint;
  onOpenChange(open: boolean): void;
  open: boolean;
  price: PriceData;
  tokenSymbol: string;
}

export default function DecreaseLimitPositionDialog({
  position,
  collateral_amount,
  onOpenChange,
  open,
  price,
  tokenSymbol,
}: ClosePositionDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [keepSameLeverage, setKeepSameLeverage] = useState(false);
  const { editPosition } = useUserPosition();
  const { getPositionInfos, getNewPositionInfos } = useUserPositionInfos();
  const { formatNumberWithoutExponent } = useFormatNumber();
  const decimals = BigInt(10 ** 6);
  const collateralAmountBigInt = BigInt(position.collateral_amount);
  const collateralUsdAmount = Number(collateralAmountBigInt) / Number(decimals);

  const formattedSizeDeltaUsdcAmount = (
    position.size_in_usd /
    BigInt(10 ** 16) /
    BigInt(10 ** 18)
  ).toString();

  const isCloseAction =
    parseFloat(inputValue) >= parseFloat(formattedSizeDeltaUsdcAmount);

  let new_size_delta_usd =
    parseFloat(inputValue) > 0
      ? BigInt(Math.round(parseFloat(inputValue) * 10 ** 16)) * BigInt(10 ** 18)
      : BigInt("0");

  let new_collateral_delta = keepSameLeverage
    ? Math.round(
        (parseFloat(inputValue) / parseFloat(formattedSizeDeltaUsdcAmount)) *
          collateralUsdAmount *
          10 ** 6,
      )
    : 0;

  console.log("new collatrela delta", new_collateral_delta);

  function onInputChange(newValue: string) {
    const formattedValue = newValue.replace(",", ".");
    if (/^\d*([.]?\d*)$/.test(formattedValue)) {
      setInputValue(formattedValue);
    }
  }

  function onPriceInputChange(newPrice: string) {
    const formattedPrice = newPrice.replace(",", ".");
    if (/^\d*([.]?\d*)$/.test(formattedPrice)) {
      setLimitPrice(formattedPrice);
    }
  }

  let limit_price =
    limitPrice === ""
      ? BigInt(0)
      : BigInt(Math.round(parseFloat(limitPrice) * 10 ** 6));

  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  const positionInfos = getPositionInfos(position);
  const newPositionInfos = getNewPositionInfos(
    position,
    BigInt(0),
    new_size_delta_usd,
    false,
  );

  const priceInfos = [
    {
      label: "Leverage",
      value_before: positionInfos.leverage,
      value_after: newPositionInfos.new_leverage,
    },
    {
      label: "Entry Price",
      value_before: formatNumberWithoutExponent(
        Number(positionInfos.entry_price),
      ),
      value_after: formatNumberWithoutExponent(
        Number(newPositionInfos.new_entry_price),
      ),
    },
    // { label: "Market Price", value_before: formatNumberWithoutExponent(priceData.currentPrice) },
    {
      label: "Liq. Price",
      value_before: formatNumberWithoutExponent(
        Number(positionInfos.liq_price),
      ),
      value_after: formatNumberWithoutExponent(
        Number(newPositionInfos.new_liq_price),
      ),
    },
    {
      label: "Size",
      value_before: formatNumberWithoutExponent(
        Number(positionInfos.size_in_usd),
      ),
      value_after: formatNumberWithoutExponent(
        Number(newPositionInfos.new_size_in_usd),
      ),
    },
    {
      label: "Collateral (USD)",
      value_before: formatNumberWithoutExponent(
        Number(positionInfos.collateral_amount),
      ),
      value_after: formatNumberWithoutExponent(
        Number(newPositionInfos.new_collateral_amount),
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <img
                alt={tokenSymbol}
                className="h-6 w-6"
                src={Tokens[tokenSymbol].icon}
              />
              {tokenSymbol}-USDC
            </div>
          </DialogTitle>
          <DialogDescription>Decrease or close your position</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <label
            htmlFor="adjustCollateralToggle"
            className="text-sm text-neutral-300"
          >
            Keep Same Leverage
          </label>
          <div
            className={`relative h-6 w-12 cursor-pointer rounded-full ${
              keepSameLeverage ? "bg-yellow-500" : "bg-gray-500"
            } transition-colors duration-300`}
            onClick={() => setKeepSameLeverage(!keepSameLeverage)}
          >
            <div
              className={`absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                keepSameLeverage ? "translate-x-6" : ""
              }`}
            ></div>
          </div>
        </div>
        <div>
          <p className="mb-1 w-full text-right text-sm text-neutral-300">
            Max: {formattedSizeDeltaUsdcAmount} USD
          </p>
        </div>
        <div className="rounded-md border border-border bg-secondary p-3">
          <div className="flex items-center justify-between">
            {inputValue ? (
              <label className="block text-xs">
                Reduce: ${Number(inputValue)}
              </label>
            ) : (
              <label className="block text-xs">Reduce</label>
            )}
            <span className="text-xs text-muted-foreground">
              Max: {formattedSizeDeltaUsdcAmount} USD
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between bg-transparent">
            <Input
              className="w-full bg-transparent text-lg"
              id="Close position"
              onChange={onInputChange}
              placeholder="0.00"
              value={inputValue}
              disabled={false}
            />
            <div className="mr-4 mt-1 flex items-center gap-1">
              <button
                className="mr-1 flex flex-shrink-0 items-center gap-2 rounded-lg bg-background px-2 py-1 transition duration-100 hover:bg-gray-800"
                onClick={() =>
                  setInputValue(formattedSizeDeltaUsdcAmount.toString())
                }
              >
                Max
              </button>
              <img alt="USDC" className="h-6 w-6" src={Tokens.USDC.icon} />
              USD
            </div>
          </div>
        </div>
        <div className="rounded-md border border-border bg-secondary p-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs">Price</label>
            <span className="text-xs text-muted-foreground">
              Price: {price.currentPrice.toFixed(2)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between bg-transparent">
            <Input
              className="w-full bg-transparent text-lg"
              id="Price position"
              onChange={onPriceInputChange}
              placeholder="0.00"
              value={limitPrice}
              disabled={false}
            />
            <div>USD</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-md border border-border p-3">
          {priceInfos.map((priceInfo, index) => (
            <PriceInfoEditPosition key={index} {...priceInfo} />
          ))}
        </div>
        {isCloseAction ? (
          <button
            className="w-full rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2 text-sm"
            onClick={() =>
              //@ts-ignore
              editPosition(
                position,
                collateral_amount,
                { MarketDecrease: {} },
                position.size_in_usd,
                limit_price,
              )
            }
          >
            Close Position
          </button>
        ) : (
          <button
            className="w-full rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2 text-sm"
            onClick={() =>
              //@ts-ignore
              editPosition(
                position,
                BigInt(new_collateral_delta),
                { LimitDecrease: {} },
                new_size_delta_usd,
                limit_price,
              )
            }
          >
            Reduce position
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
