/* eslint-disable @next/next/no-img-element */
"use client";

import { Tokens } from "@zohal/app/_helpers/tokens";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@zohal/app/_ui/Modal";
import Input from "@zohal/app/_ui/input";
import { useState, ChangeEvent, useEffect } from "react";

import useUserPosition, { Position } from "../_hooks/use-user-position";

interface ClosePositionDialogProps {
  position: Position;
  collateral_amount: bigint;
  collateral_token: bigint;
  onOpenChange(open: boolean): void;
  open: boolean;
}

export default function IncreaseCollateralDialog({
  position,
  collateral_amount,
  collateral_token,
  onOpenChange,
  open,
}: ClosePositionDialogProps) {
  const decimals = BigInt(Math.pow(10, 18));
  const [inputValue, setInputValue] = useState(
    "" + (collateral_amount / decimals).toString(),
  );
  const { closePosition } = useUserPosition();

  const formattedCollateralAmount = (collateral_amount / decimals).toString();

  const isCloseAction =
    parseFloat(inputValue) >= parseFloat(formattedCollateralAmount);

  function onInputChange(newValue: string) {
    setInputValue(newValue);
  }

  useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <img alt="ETH" className="h-6 w-6" src={Tokens.ETH.icon} />
              ETH-USDC
            </div>
          </DialogTitle>
          <DialogDescription>Increase your collateral</DialogDescription>
        </DialogHeader>
        <div className="-mb-3">
          <p className="w-full text-right text-sm text-neutral-300">
            Max: {formattedCollateralAmount} ETH
          </p>
        </div>
        <Input
          className="rounded-lg border border-[#363636] bg-transparent px-3 py-3 text-sm"
          id="Close position"
          onChange={onInputChange}
          placeholder="Collateral amount to add"
          value={inputValue}
        />

          <button
            className="w-full rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2 text-sm"
            onClick={() =>
              //@ts-ignore
              closePosition(position, collateral_token, collateral_amount, { MarketIncrease: {} }, BigInt(0))
            }
          >
            Increase collateral
          </button>
      </DialogContent>
    </Dialog>
  );
}
