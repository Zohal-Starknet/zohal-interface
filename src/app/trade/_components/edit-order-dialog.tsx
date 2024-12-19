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
import { BTC_MARKET_TOKEN_CONTRACT_ADDRESS, ETH_MARKET_TOKEN_CONTRACT_ADDRESS, STRK_MARKET_TOKEN_CONTRACT_ADDRESS } from "@zohal/app/_lib/addresses";
import PriceInfo from "./price-info";
import useMarketTokenBalance from "@zohal/app/_hooks/use-market-token-balance";
import useFormatNumber from "../_hooks/use-format-number";
import useUserPositionInfos from "../_hooks/use-user-position-infos";
import PriceInfoEditPosition from "./price-info-edit-position";
import useUserOrder, { defaultOrder, Order } from "../_hooks/use-user-order";

interface EditOrderDialogProps {
  order: Order;
  old_size_delta: string;
  old_trigger_price: string;
  onOpenChange(open: boolean): void;
  open: boolean;
}

export default function EditOrderDialog({
  order,
  old_size_delta,
  old_trigger_price,
  onOpenChange,
  open,
}: EditOrderDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("ETH");
  const [ orderState, setOrderState ] = useState(defaultOrder);
  const { formatNumberWithoutExponent } = useFormatNumber();

  let new_size_delta_usd = parseFloat(inputValue) > 0
  ? BigInt(Math.round(parseFloat(inputValue) * 10 ** 16)) * BigInt(10 ** 18)
  : BigInt("0");

  if (order.market === ETH_MARKET_TOKEN_CONTRACT_ADDRESS) {
    setTokenSymbol("ETH");
  } else if (order.market === BTC_MARKET_TOKEN_CONTRACT_ADDRESS) {
      setTokenSymbol("BTC");
  } else if (order.market === STRK_MARKET_TOKEN_CONTRACT_ADDRESS) {
      setTokenSymbol("STRK");
  }

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
    limitPrice === "" ? BigInt(0) : BigInt(Math.round(parseFloat(limitPrice) * 10 ** 6));

  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  const priceInfos = [
    { label: "Leverage", value_before: "1", value_after: "1" },
    { label: "Entry Price", value_before: "1", value_after: "1"  },
    { label: "Market Price", value_before: "1", value_after: "1" },
    { label: "Liq. Price", value_before: "1", value_after: "1" },
    { label: "Size", value_before: "1", value_after: "1" },
    { label: "Collateral (USD)", value_before: "1", value_after: "1" },
  ];

  // const { sendEdit } = useUserOrder(
  //     orderState,
  //     orderState.key,
  //     new_size_delta_usd,
  //     limit_price
  //   );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <img alt={tokenSymbol} className="h-6 w-6" src={Tokens[tokenSymbol].icon} />
              {tokenSymbol}-USDC
            </div>
          </DialogTitle>
          <DialogDescription>Edit your order</DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-border bg-secondary p-3">
          <div className="flex items-center justify-between">
            { inputValue ?
              <label className="block text-xs">New Size delta: ${formatNumberWithoutExponent(Number(inputValue))}</label>
              :
              <label className="block text-xs">New Size delta</label>
            }
            <span className="text-xs text-muted-foreground">
            Old Size Delta: {old_size_delta}
          </span>
          </div>
          <div className="mt-1 flex items-center justify-between bg-transparent">
            <Input
              className="w-full bg-transparent text-lg"
              id="Increase collateral"
              onChange={onInputChange}
              placeholder="0.00"
              value={inputValue}
              disabled={false}
            />
          <div className="mt-1 mr-4 flex items-center gap-1">
            <img alt="USDC" className="h-6 w-6" src={Tokens.USDC.icon} />
            USD
          </div>
        </div>
      </div>
      <div className="rounded-md border border-border bg-secondary p-3">
          <div className="flex items-center justify-between">
            { inputValue ?
              <label className="block text-xs">New Trigger Price: ${formatNumberWithoutExponent(Number(limitPrice))}</label>
              :
              <label className="block text-xs">New Trigger Price</label>
            }
            <span className="text-xs text-muted-foreground">
            Old Trig. Price: {old_trigger_price}
          </span>
          </div>
          <div className="mt-1 flex items-center justify-between bg-transparent">
            <Input
              className="w-full bg-transparent text-lg"
              id="Increase collateral"
              onChange={onPriceInputChange}
              placeholder="0.00"
              value={limitPrice}
              disabled={false}
            />
          <div className="mt-1 mr-4 flex items-center gap-1">
            <img alt="USDC" className="h-6 w-6" src={Tokens.USDC.icon} />
            USD
          </div>
        </div>
      </div>
        <div className="flex flex-col gap-2 rounded-md border border-border p-3">
        {priceInfos.map((priceInfo, index) => (
          <PriceInfoEditPosition key={index} {...priceInfo} />
        ))}
        </div>
        <button
          className="w-full rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2 text-sm"
          onClick={() => {setOrderState(order); }}
        >
          Edit Order
        </button>
      </DialogContent>
    </Dialog>
  );
}
