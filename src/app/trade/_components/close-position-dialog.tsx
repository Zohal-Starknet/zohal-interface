/* eslint-disable @next/next/no-img-element */
"use client";

import { Tokens } from "@zohal/app/_helpers/tokens";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@zohal/app/_ui/Modal";
import { useState, useEffect } from "react";

import useUserPosition from "../_hooks/use-user-position";
import Divider from "@zohal/app/_ui/divider";
import SwapInput from "./swap-input";
import Button from "@zohal/app/_ui/button";

function ClosePositionDialogInfos() {
  return (
    <div className="flex flex-col gap-1.5 text-xs">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Leverage</p>
        <p>0.95</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Keep leverage at 0.95x</p>
        <p>0.95</p>
      </div>
      <Divider className="my-2" />
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Entry Price</p>
        <p>$0.1199</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Acceptable Price</p>
        <p>$0.1232</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Mark Price</p>
        <p>$0.1237</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Liq. Price</p>
        <p>
          <span className="text-muted-foreground">0.0104 → </span>$0.2000
        </p>
      </div>
      <Divider className="my-2" />
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Size</p>
        <p>
          <span className="text-muted-foreground">$7.79 → </span>$4.79
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">PnL</p>
        <p>
          <span className="text-muted-foreground">+$0.24 (+3.06%) → </span>$0.15
          (+3.06%)
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Collateral (WETH)</p>
        <p>
          <span className="text-muted-foreground">$8.12 → </span>$4.99
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Fees and Price Impact</p>
        <p>-$0.01</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Network Fee</p>
        <p>-$176.43</p>
      </div>
      <Divider className="my-2" />
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Receive</p>
        <p>0.0009 ETH ($3.21)</p>
      </div>
    </div>
  );
}

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

  useEffect(() => {
    if (!open) {
      setInputValue(""); 
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
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
        <SwapInput
          id="closePosition"
          formattedTokenBalance={formattedCollateralAmount}
          inputValue={inputValue}
          label="Close"
          onInputChange={onInputChange}
        >
          <Button
            size="sm"
            className="h-7 text-sm"
            variant="secondary"
            onClick={() => onInputChange(formattedCollateralAmount)}
          >
            Max
          </Button>
        </SwapInput>
        <ClosePositionDialogInfos />

        {isCloseAction ? (
          <button
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
            onClick={() => {
              closePosition(collateral_token, collateral_amount);
              onOpenChange(false); 
            }}
          >
            Close Position
          </button>
        ) : (
          <button
            className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm"
            onClick={() => {
              closePosition(collateral_token, collateral_amount);
              onOpenChange(false); 
            }}
          >
            Reduce position
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
