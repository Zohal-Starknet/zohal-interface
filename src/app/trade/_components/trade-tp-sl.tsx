"use client";

import { TokenSymbol, Tokens } from "@zohal/app/_helpers/tokens";
import useMarketTokenBalance from "@zohal/app/_hooks/use-market-token-balance";
import { type PropsWithClassName } from "@zohal/app/_lib/utils";
import { useEffect, useState } from "react";

import Button from "../../_ui/button";
import Fieldset from "../../_ui/fieldset";
import Form from "../../_ui/form";
import Input from "../../_ui/input";
import useMarketTrade from "../_hooks/use-market-trade";
import ChooseTokenButton from "./choose-token-button";
import PriceInfo from "./price-info";
import TokenSwapButton from "./token-swap-button";
import TradeLeverageInput from "./trade-leverage-input";
import {
  ETH_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS,
} from "../../_lib/addresses";
import { useTokenInputs } from "../_hooks/use-token-input";
import useEthPrice from "@zohal/app/trade/_hooks/use-market-data";

import SlTpCheckbox from "./sl-tp-checkbox";
import { SlTpInfos } from "./sl-tp-modal";
import { useToast } from "@zohal/app/_ui/use-toast";
import { Heading4Icon } from "lucide-react";
import useBtcPrice from "../_hooks/use-market-data-btc";
import useStrkPrice from "../_hooks/use-market-data-strk";
import useTpSl from "../_hooks/use-tp-sl";

export default function TradeTpSl({ className }: PropsWithClassName) {
  const [sizePosition, setSizePosition] = useState("");
  const [triggerPrice, setTriggerPrice] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState<TokenSymbol>("ETH");
  const { ethData } = useEthPrice();
  const { btcData } = useBtcPrice();
  const { strkData } = useStrkPrice();
  const [priceData, setPriceData] = useState(ethData);
  console.log("this is priceData", priceData);

  const { tpSl } = useTpSl();
  const { toast } = useToast();

  const onSizePositionChange = (newPositionSize: string) => {
    const formattedValue = newPositionSize.replace(",", ".");
    if (/^\d*([.]?\d*)$/.test(formattedValue)) {
      setSizePosition(formattedValue);
    }
  };

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
  };

  const priceInfos = [
    { label: "Pool", value: tokenSymbol + "-USDC" },
    { label: "Collateral in", value: "USDC" },
    { label: "Fees", value: "$0" },
  ];

  const handleTrade = (isBuy: boolean) => {
    tpSl(tokenSymbol, sizePosition, isBuy, triggerPrice);
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

      <div className="mt-1 flex items-center justify-between rounded-md border border-border bg-transparent p-3">
        <h4>Market :</h4>
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
