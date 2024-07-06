/* eslint-disable @next/next/no-img-element */
"use client";

import { Tokens } from "@zohal/app/_helpers/tokens";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@zohal/app/_ui/Modal";
import Input from "@zohal/app/_ui/input";
import { useState, ChangeEvent, PropsWithChildren } from "react";

import useUserPosition from "../_hooks/use-user-position";

interface ClosePositionDialogProps {
  collateral_amount: bigint;
  collateral_token: bigint;
  onOpenChange(open: boolean): void;
  open: boolean;
}

export default function ClosePositionDialog({
  collateral_amount,
  collateral_token,
  open,
  onOpenChange,
}: ClosePositionDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const { closePosition } = useUserPosition();

  const decimals = BigInt(Math.pow(10, 18));
  const formattedCollateralAmount = (collateral_amount / decimals).toString();

  const isCloseAction =
    parseFloat(inputValue) >= parseFloat(formattedCollateralAmount);

  function onInputChange(newValue: string) {
    setInputValue(newValue);
  }

  if (!open) {
    return null;
  }

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
          <DialogDescription>Adjust or close your position</DialogDescription>
        </DialogHeader>
        <div className="-mb-3">
          <p className="w-full text-right text-sm text-neutral-300">
            Max: {formattedCollateralAmount} ETH
          </p>
        </div>
        <Input
          className="border-border rounded-lg border bg-transparent px-3 py-3 text-sm"
          id="Close position"
          onChange={onInputChange}
          placeholder="Collateral amount to remove"
          value={inputValue}
        />
        {isCloseAction ? (
          <button
            className="border-border bg-secondary w-full rounded-lg border px-3 py-2 text-sm"
            onClick={() => closePosition(collateral_token, collateral_amount)}
          >
            Close Position
          </button>
        ) : (
          <button
            className="border-border bg-secondary w-full rounded-lg border px-3 py-2 text-sm"
            onClick={() => closePosition(collateral_token, collateral_amount)}
          >
            Reduce position
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
