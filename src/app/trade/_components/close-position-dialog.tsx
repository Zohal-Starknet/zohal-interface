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
import { useState } from "react";

import useUserPosition from "../_hooks/use-user-position";

interface ClosePositionDialogProps {
  collateral_amount: bigint;
  collateral_token: bigint;
}

export default function ClosePositionDialog({
  collateral_amount,
  collateral_token,
}: ClosePositionDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const { closePosition } = useUserPosition();

  const formattedCollateralAmount = (collateral_amount / 10n ** 18n).toString();

  const isCloseAction =
    parseFloat(inputValue) >= parseFloat(formattedCollateralAmount);

  function onInputChange(newValue: string) {
    setInputValue(newValue);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2">
          Edit
        </button>
      </DialogTrigger>
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
          className="rounded-lg border border-[#363636] bg-transparent px-3 py-3 text-sm"
          id="Close position"
          onChange={onInputChange}
          placeholder="Collateral amount to remove"
          value={inputValue}
        />
        {isCloseAction ? (
          <button
            className="w-full rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2 text-sm"
            onClick={() => closePosition(collateral_token)}
          >
            Close Position
          </button>
        ) : (
          <button
            className="w-full rounded-lg border border-[#363636] bg-[#1b1d22] px-3 py-2 text-sm"
            onClick={() => closePosition(collateral_token)}
          >
            Reduce position
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}