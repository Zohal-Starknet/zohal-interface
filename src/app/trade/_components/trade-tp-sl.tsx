"use client";

import { TokenSymbol, Tokens } from "@zohal/app/_helpers/tokens";
import { type PropsWithClassName } from "@zohal/app/_lib/utils";
import { useEffect, useState } from "react";

import Button from "../../_ui/button";
import Form from "../../_ui/form";
import Input from "../../_ui/input";
import ChooseTokenButton from "./choose-token-button";
import PriceInfo from "./price-info";
import useEthPrice, { usePriceDataSubscription } from "@zohal/app/trade/_hooks/use-market-data";

import { useToast } from "@zohal/app/_ui/use-toast";
import useTpSl from "../_hooks/use-tp-sl";

export default function TradeTpSl({ className }: PropsWithClassName) {
  const [sizePosition, setSizePosition] = useState("");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState<TokenSymbol>("ETH");
  const { tokenData: ethData } = usePriceDataSubscription({ pairSymbol: "ETH/USD" });
  const { tokenData: btcData } = usePriceDataSubscription({ pairSymbol: "BTC/USD" });
  const { tokenData: strkData } = usePriceDataSubscription({ pairSymbol: "STRK/USD" });
  const [priceData, setPriceData] = useState(ethData);
  console.log("this is priceData", priceData)

  const { tpSl } = useTpSl();
  const { toast } = useToast();

  const onSizePositionChange = (newPositionSize: string) => {
    const formattedValue = newPositionSize.replace(",", ".");
    if (/^\d*([.]?\d*)$/.test(formattedValue)) {
      setSizePosition(formattedValue);
    }
  }

  const onTriggerPriceChange = (newTriggerPrice: string) => {
    const formattedValue = newTriggerPrice.replace(",", ".");
    if (/^\d*([.]?\d*)$/.test(formattedValue)) {
      setTriggerPrice(formattedValue);
    }
  };

  const onTokenSymbolChange = (newTokenSymbol: string) => {
    setTokenSymbol(newTokenSymbol);
    if (newTokenSymbol === "ETH") {
      setPriceData(ethData);
    }
    if (newTokenSymbol === "BTC") {
      setPriceData(btcData);
    }
    if (newTokenSymbol === "STRK") {
      setPriceData(strkData);
    }
  }

  const priceInfos = [
    { label: "Pool", value: tokenSymbol + "-USDC" },
    { label: "Collateral in", value: "USDC" },
    { label: "Fees", value: "$0" },
  ];

  const handleTrade = (isBuy: boolean) => {
    tpSl(tokenSymbol, sizePosition, isBuy, triggerPrice)
    // toast({
    //   title: `Trade Executed`,
    //   description: `You have ${isBuy ? "long" : "short"} ${payTokenValue} ${tokenSymbol.name}`,
    // });
  };

  return (
    <Form className={className}>
      <div className="rounded-md border border-border bg-secondary p-3">
        <div className="flex items-center justify-between">
            <div>
            <div className="flex items-center justify-between">
            <label className="block text-xs">Close</label>
            {/* <span className="text-xs text-muted-foreground">
                Balance: {payTokenBalance}
            </span> */}
            </div>
            <div className="mt-1 flex items-center justify-between bg-transparent">
            <Input
                className="w-full bg-transparent text-lg"
                onChange={onSizePositionChange}
                placeholder="0.00"
                value={sizePosition}
                disabled={false}
            />
            </div>
            </div>
            <div className=" mt-1 flex items-center gap-1">
                <img alt="USDC" className="h-6 w-6" src={Tokens.USDC.icon} />
                USD
            </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-secondary p-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs">Price</label>
          { 
            <span className="text-xs text-muted-foreground">
              Market Price: ${priceData.currentPrice.toFixed(2)}
            </span>
          }
        </div>
        <div className="mt-1 flex items-center justify-between bg-transparent">
          <Input
            className="w-full bg-transparent text-lg"
            onChange={onTriggerPriceChange}
            placeholder="0.00"
            value={triggerPrice}
            disabled={false}
          />
          <div>USD</div>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between bg-transparent rounded-md border border-border p-3">
      <h4 >Market :</h4>
          <ChooseTokenButton
            onTokenSymbolChange={onTokenSymbolChange}
            tokenSymbol={tokenSymbol}
          />
        </div>

      <div className="flex flex-col gap-2 rounded-md border border-border p-3">
        {priceInfos.map((priceInfo, index) => (
          <PriceInfo key={index} {...priceInfo} />
        ))}
      </div>

      <div className="mt-4 grid w-full grid-cols-2 items-center gap-2">
        <Button
          onClick={() => handleTrade(true)}
          type="submit"
          variant="success"
        >
          Long
        </Button>
        <Button
          onClick={() => handleTrade(false)}
          type="submit"
          variant="danger"
        >
          Short
        </Button>
      </div>
    </Form>
  );
}