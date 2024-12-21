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
import { useState } from "react";
import {
  BTC_MARKET_TOKEN_CONTRACT_ADDRESS,
  ETH_MARKET_TOKEN_CONTRACT_ADDRESS,
  STRK_MARKET_TOKEN_CONTRACT_ADDRESS,
} from "@zohal/app/_lib/addresses";
import useUserOrder, { Order } from "../_hooks/use-user-order";

interface CancelOrderDialogProps {
  order: Order;
  onOpenChange(open: boolean): void;
  open: boolean;
}

export default function CancelOrderDialog({
  order,
  onOpenChange,
  open,
}: CancelOrderDialogProps) {
  const [tokenSymbol, setTokenSymbol] = useState("ETH");

  if (order.market === ETH_MARKET_TOKEN_CONTRACT_ADDRESS) {
    setTokenSymbol("ETH");
  } else if (order.market === BTC_MARKET_TOKEN_CONTRACT_ADDRESS) {
    setTokenSymbol("BTC");
  } else if (order.market === STRK_MARKET_TOKEN_CONTRACT_ADDRESS) {
    setTokenSymbol("STRK");
  }

  const priceInfos = [
    { label: "Leverage", value_before: "1", value_after: "1" },
    { label: "Entry Price", value_before: "1", value_after: "1" },
    { label: "Market Price", value_before: "1", value_after: "1" },
    { label: "Liq. Price", value_before: "1", value_after: "1" },
    { label: "Size", value_before: "1", value_after: "1" },
    { label: "Collateral (USD)", value_before: "1", value_after: "1" },
  ];

  const { sendCancel } = useUserOrder(
    order,
    order.key,
    BigInt(0),
    BigInt(0),
    onOpenChange,
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
          <DialogDescription>Cancel your order</DialogDescription>
        </DialogHeader>
        <button
          className="w-full rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2 text-sm"
          onClick={() => {
            sendCancel();
          }}
        >
          Cancel Order
        </button>
      </DialogContent>
    </Dialog>
  );
}
