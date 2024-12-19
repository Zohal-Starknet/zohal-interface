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
import useEthPrice, { usePriceDataSubscription } from "../_hooks/use-market-data";
import useBtcPrice from "../_hooks/use-market-data-btc";
import useStrkPrice from "../_hooks/use-market-data-strk";
import useUserPositionInfos from "../_hooks/use-user-position-infos";
import useFormatNumber from "../_hooks/use-format-number";
import PriceInfoEditPosition from "./price-info-edit-position";
import { CairoCustomEnum } from "starknet";

interface ClosePositionDialogProps {
  position: Position;
  collateral_amount: bigint;
  onOpenChange(open: boolean): void;
  open: boolean;
}

export default function DecreaseCollateralDialog({
  position,
  collateral_amount,
  onOpenChange,
  open,
}: ClosePositionDialogProps) {
  const [orderType, setOrderType] = useState({ LimitDecrease: {} } as unknown as CairoCustomEnum);
  const [checkedTp, setCheckedLong] = useState(true);
  const [checkedSl, setCheckedShort] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [slippage, setSlippage] = useState("0.03");
  const [limitOrder, setLimitOrder] = useState(false);
  const [keepSameLeverage, setKeepSameLeverage] = useState(false);
  const decimals = BigInt(10 ** 6);
  const collateralAmountBigInt = BigInt(position.collateral_amount);
  const collateralUsdAmount = Number(collateralAmountBigInt) / Number(decimals);
  const formattedSizeDeltaUsdcAmount = (
    position.size_in_usd /
    BigInt(10 ** 16) /
    BigInt(10 ** 18)
  ).toString();

  const { tokenData: ethData } = usePriceDataSubscription({ pairSymbol: "ETH/USD" });
  const { tokenData: btcData } = usePriceDataSubscription({ pairSymbol: "BTC/USD" });
  const { tokenData: strkData } = usePriceDataSubscription({ pairSymbol: "STRK/USD" });
  const [priceData, setPriceData] = useState(ethData);
  const [tokenSymbol, setTokenSymbol] = useState("ETH")
  const { getPositionInfos, getNewPositionInfos } = useUserPositionInfos();
  const { formatNumberWithoutExponent } = useFormatNumber();

  useEffect(() => {
    console.log("MARKEET", position.market)
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

  const isCloseAction = parseFloat(inputValue) >= collateralUsdAmount;

  let new_collateral_delta =
  inputValue !== "" && parseFloat(inputValue) > 0
    ? BigInt(Math.round(parseFloat(inputValue) * 10 ** 6))
    : BigInt("0");

  let new_size_delta_usd = keepSameLeverage && inputValue && collateralUsdAmount && formattedSizeDeltaUsdcAmount
    ? BigInt(
        Math.round(
          (parseFloat(inputValue) / collateralUsdAmount) *
            parseFloat(formattedSizeDeltaUsdcAmount) *
            10 ** 6
        )
      ) * BigInt(10**28)
    : BigInt(0);

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

  const onLongTpSlChange = (checked: boolean) => {
    if (checked) {
      setCheckedLong(checked);
      setCheckedShort(false);
      setOrderType({ LimitDecrease: {} } as unknown as CairoCustomEnum)
    }
  };

  const onShortTpSlChange = (checked: boolean) => {
    if (checked) {
      setCheckedLong(false);
      setCheckedShort(checked);
      setOrderType({ StopLossDecrease: {} } as unknown as CairoCustomEnum)
    }
  };
  
  let limit_price =
    limitPrice === "" ? BigInt(0) : BigInt(Math.round(parseFloat(limitPrice) * 10 ** 6));

  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  const positionInfos = getPositionInfos(position);
  const newPositionInfos = getNewPositionInfos(position, new_collateral_delta, new_size_delta_usd, false);

  const priceInfos = [
    { label: "Leverage", value_before: positionInfos.leverage, value_after: newPositionInfos.new_leverage },
    { label: "Entry Price", value_before: formatNumberWithoutExponent(Number(positionInfos.entry_price)), value_after: formatNumberWithoutExponent(Number(newPositionInfos.new_entry_price)) },
    { label: "Market Price", value_before: formatNumberWithoutExponent(priceData.currentPrice) },
    { label: "Liq. Price", value_before: formatNumberWithoutExponent(Number(positionInfos.liq_price)), value_after: formatNumberWithoutExponent(Number(newPositionInfos.new_liq_price)) },
    { label: "Size", value_before: formatNumberWithoutExponent(Number(positionInfos.size_in_usd)), value_after: formatNumberWithoutExponent(Number(newPositionInfos.new_size_in_usd)) },
    { label: "Collateral (USD)", value_before: formatNumberWithoutExponent(Number(positionInfos.collateral_amount)), value_after: formatNumberWithoutExponent(Number(newPositionInfos.new_collateral_amount)) },
  ];

  const { send, isLoading, isPending } = useUserPosition(
    position,
    collateral_amount,
    limitPrice === ""
      ? //@ts-ignore
        { MarketDecrease: {} }
      : orderType,
    position.size_in_usd,
    limit_price,
    onOpenChange,
    slippage
  );

  const { send: sendClose, isLoading: isLoadingClose, isPending: isPendingClose } = useUserPosition(
    position,
    BigInt(new_collateral_delta),
    limitPrice === ""
      ? //@ts-ignore
        { MarketDecrease: {} }
      : orderType,
    new_size_delta_usd,
    limit_price,
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
          <DialogDescription>Decrease your collateral</DialogDescription>
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
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="limitOrder"
              checked={limitOrder}
              onChange={(e) => setLimitOrder(e.target.checked)}
              className="h-4 w-4 cursor-pointer"
            />
            <label htmlFor="limitOrder" className="text-sm text-neutral-300">
              Limit order
            </label>
          </div>
        </div>
        <div className="rounded-md border border-border bg-secondary p-3">
          <div className="flex items-center justify-between">
            {inputValue ? (
              <label className="block text-xs">
                Reduce: ${formatNumberWithoutExponent(Number(inputValue))}
              </label>
            ) : (
              <label className="block text-xs">Reduce</label>
            )}
            <span className="text-xs text-muted-foreground">
              Max: {formatNumberWithoutExponent(collateralUsdAmount)} USD
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between bg-transparent">
            <Input
              className="w-full bg-transparent text-lg"
              id="Reduce collateral"
              onChange={onInputChange}
              placeholder="0.00"
              value={inputValue}
              disabled={false}
            />
            <div className="mr-4 mt-1 flex items-center gap-1">
              <button
                className="mr-1 flex flex-shrink-0 items-center gap-2 rounded-lg bg-background px-2 py-1 transition duration-100 hover:bg-gray-800"
                onClick={() => setInputValue(collateralUsdAmount.toString())}
              >
                Max
              </button>
              <img alt="USDC" className="h-6 w-6" src={Tokens.USDC.icon} />
              USD
            </div>
          </div>
        </div>
        {limitOrder ? (
          <div className="rounded-md border border-border bg-secondary p-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs">Price</label>
              <span className="text-xs text-muted-foreground">
                Price: {priceData.currentPrice.toFixed(2)}
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
        ) : (
          <></>
        )}
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="Long Tp/Sl"
              checked={checkedTp}
              onChange={(e) => onLongTpSlChange(e.target.checked)}
              className="h-4 w-4 cursor-pointer"
            />
            <label htmlFor="limitOrder" className="text-sm text-neutral-300">
              Take Profit
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="Short Tp/Sl"
              checked={checkedSl}
              onChange={(e) => onShortTpSlChange(e.target.checked)}
              className="h-4 w-4 cursor-pointer"
            />
            <label htmlFor="limitOrder" className="text-sm text-neutral-300">
              Stop Loss
            </label>
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
            onClick={() => send()}
          >
            Close Position
          </button>
        ) : (
          <button
            className="w-full rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2 text-sm"
            onClick={() => sendClose()}
          >
            Reduce collateral
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
