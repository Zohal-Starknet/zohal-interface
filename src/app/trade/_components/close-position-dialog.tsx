/* eslint-disable @next/next/no-img-element */
"use client";

import { Tokens } from "@zohal/app/_helpers/tokens";
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
  onClose: () => void;
}

export default function ClosePositionDialog({
  collateral_amount,
  collateral_token,
  onClose,
}: ClosePositionDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const { closePosition } = useUserPosition();

  const decimals = BigInt(Math.pow(10, 18));
  const formattedCollateralAmount = (collateral_amount / decimals).toString();

  const isCloseAction =
    parseFloat(inputValue) >= parseFloat(formattedCollateralAmount);

  useEffect(() => {
    setInputValue("");
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    closePosition(collateral_token, collateral_amount);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ transition: "opacity 0.3s, transform 0.3s", opacity: 1, transform: "scale(1)" }}
    >
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ transition: "backdrop-filter 0.3s", backdropFilter: "blur(5px)" }}
        onClick={onClose}
      ></div>
      <div
        className="relative bg-background rounded-lg shadow-lg p-6 w-full max-w-md"
        style={{ transition: "opacity 0.3s, transform 0.3s", opacity: 1, transform: "scale(1)" }}
      >
        <div className="flex items-center gap-2">
          <img alt="ETH" className="h-6 w-6" src={Tokens.ETH.icon} />
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            ETH-USDC
          </h2>
          <button className="ml-auto" onClick={onClose}>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <p className="text-sm text-muted-foreground">Adjust or close your position</p>
        <div className="my-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-muted-foreground">Close</label>
            <span>Balance: {formattedCollateralAmount}</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button
              size="sm"
              className="h-7 text-sm"
              variant="secondary"
              onClick={() => setInputValue(formattedCollateralAmount)}
            >
              Max
            </Button>
          </div>
        </div>
        <ClosePositionDialogInfos />

        <button
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm mt-4"
          onClick={handleClose}
        >
          {isCloseAction ? "Close Position" : "Reduce position"}
        </button>
      </div>
    </div>
  );
}
