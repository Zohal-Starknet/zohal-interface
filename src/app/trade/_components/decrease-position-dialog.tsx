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
import useUserPositionInfos from "../_hooks/use-user-position-infos";
import useFormatNumber from "../_hooks/use-format-number";
import PriceInfoEditPosition from "./price-info-edit-position";
import { CairoCustomEnum } from "starknet";
import {  usePrices } from "../_hooks/use-market-data";

interface ClosePositionDialogProps {
  position: Position;
  collateral_amount: bigint;
  onOpenChange(open: boolean): void;
  open: boolean;
}

export default function DecreasePositionDialog({
  position,
  collateral_amount,
  onOpenChange,
  open,
}: ClosePositionDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const [keepSameLeverage, setKeepSameLeverage] = useState(false);
  const { getPositionInfos, getNewPositionInfos } = useUserPositionInfos();
  const { formatNumberWithoutExponent } = useFormatNumber();
  const decimals = BigInt(10 ** 6);
  const collateralAmountBigInt = BigInt(position.collateral_amount);
  const collateralUsdAmount = Number(collateralAmountBigInt) / Number(decimals);

  // const { tokenData: ethData } = usePriceDataSubscription({ pairSymbol: "ETH/USD" });
  // const { tokenData: btcData } = usePriceDataSubscription({ pairSymbol: "BTC/USD" });
  // const { tokenData: strkData } = usePriceDataSubscription({ pairSymbol: "STRK/USD" });
  const { prices } = usePrices();
  const ethData = prices["ETH/USD"];
  const btcData = prices["BTC/USD"];
  const strkData = prices["STRK/USD"];
  const [priceData, setPriceData] = useState(ethData);
  const [tokenSymbol, setTokenSymbol] = useState("ETH")
  
  useEffect(() => {
    if (position.market == (BigInt(ETH_MARKET_TOKEN_CONTRACT_ADDRESS)).toString()) {
      setPriceData(ethData);
      setTokenSymbol("ETH")
    } else if (position.market == (BigInt(BTC_MARKET_TOKEN_CONTRACT_ADDRESS)).toString()) {
      setPriceData(btcData);
      setTokenSymbol("BTC")
  } else if (position.market == (BigInt(STRK_MARKET_TOKEN_CONTRACT_ADDRESS)).toString()) {
      setPriceData(strkData);
      setTokenSymbol("STRK")
    }
  }, [position.market, ethData, btcData, strkData]);

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
      : BigInt(0);

  let new_collateral_delta = keepSameLeverage
    ? Math.round(
        (parseFloat(inputValue) / parseFloat(formattedSizeDeltaUsdcAmount)) *
          collateralUsdAmount *
          10 ** 6,
      )
    : 0;

  function onInputChange(newValue: string) {
    const formattedValue = newValue.replace(",", ".");
    if (/^\d*([.]?\d*)$/.test(formattedValue)) {
      setInputValue(formattedValue);
    }
  }

  const [slippage, setSlippage] = useState("0.03");

  function onSlippageChange(newSlippage: string) {
    const formattedSlippage = newSlippage.replace(",", ".");
    if (formattedSlippage.length > 4) {
        return;
    }
    if (/^\d*([.]?\d*)$/.test(formattedSlippage)) {
        const numericValue = parseFloat(formattedSlippage);
        if (numericValue <= 100 || isNaN(numericValue)) {
            setSlippage(formattedSlippage);
        }
    }
  }

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

  const { send, isLoading, isPending } = useUserPosition(
    position,
    BigInt(new_collateral_delta),
    { MarketDecrease: {} } as unknown as CairoCustomEnum,
    new_size_delta_usd,
    BigInt("0"),
    onOpenChange,
    slippage
      );
  
  
    const { send: sendClose, isLoading: isLoadingClose, isPending: isPendingClose } = useUserPosition(
      position,
      collateral_amount,
      { MarketDecrease: {} } as unknown as CairoCustomEnum,
      position.size_in_usd,
      BigInt("0"),
      onOpenChange,
      slippage
    );

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
              Max: {formatNumberWithoutExponent(Number(formattedSizeDeltaUsdcAmount))} USD
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
        <div className="flex items-center justify-between rounded-md border border-neutral-700 p-3">
          <label
            htmlFor="allowedSlippage"
            className="text-sm text-neutral-300 flex-shrink-0"
          >
            Allowed Slippage
          </label>
          <div className="flex items-center">
            <Input
              className="bg-secondary rounded-md border border-neutral-700 text-lg outline-none text-right w-12"
              id="PricePosition"
              onChange={onSlippageChange}
              placeholder="0.00"
              value={slippage}
              disabled={false}
            />
            <div className="text-lg ml-1">%</div>
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
            onClick={() => sendClose() }
          >
            Close Position
          </button>
        ) : (
          <button
            className="w-full rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2 text-sm"
            onClick={() => send() }
          >
            Reduce position
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
