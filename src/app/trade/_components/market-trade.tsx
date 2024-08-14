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
import { ETH_CONTRACT_ADDRESS } from "../../_lib/addresses";
import { useTokenInputs } from "../_hooks/use-token-input";
import useEthPrice from "@zohal/app/trade/_hooks/use-market-data";

import SlTpCheckbox from "./sl-tp-checkbox";
import { SlTpInfos } from "./sl-tp-modal";
import { useToast } from "@zohal/app/_ui/use-toast";
import TradeLimitInput from "./trade-limit-input";

export default function Trade({ className }: PropsWithClassName) {
  const [tokenSymbol, setTokenSymbol] = useState({
    address: ETH_CONTRACT_ADDRESS,
    decimals: 18,
    icon: "/tokens/ethereum.png",
    name: "Ethereum",
  });
  const initialRatio = 1;
  const [leverage, setLeverage] = useState(1);
  const { ethData } = useEthPrice();
  const {
    payTokenSymbol,
    payTokenValue,
    receiveTokenValue,
    setTokenRatio,
    updateReceiveTokenValue,
    updatePayTokenTradeValue,
    switchTokens,
  } = useTokenInputs({ ratio: initialRatio, leverage: leverage });

  const { marketTokenBalance: payTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens[payTokenSymbol].address,
    decimal: Tokens[payTokenSymbol].decimals,
  });

  const { marketTokenBalance: ethTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens.ETH.address,
    decimal: Tokens.ETH.decimals,
  });
  // TODO @YohanTz: Type properly
  const [slTpInfos, setSlTpInfos] = useState<SlTpInfos>({
    sl: "",
    slTriggerPrice: ""+ethData.currentPrice,
    tp: "",
    tpTriggerPrice: ""+ethData.currentPrice,
  });

  const { trade } = useMarketTrade();
  const { toast } = useToast(); 

  const onTokenSymbolChange = (_tokenSymbol: TokenSymbol) => switchTokens();

  useEffect(() => {
    const fetchedRatio = ethData.currentPrice;
    setTokenRatio(payTokenSymbol === "USDC" ? 1 / fetchedRatio : 1);
  }, [switchTokens]);

  const priceInfos = [
    { label: "Pool", value: "ETH-USDC" },
    { label: "Collateral in", value: payTokenSymbol },
    { label: "Leverage", value: "" + leverage },
    { label: "Liq. Price", value: "-" },
    { label: "Fees", value: "$0" },
  ];

  const handleTrade = (isBuy: boolean) => {
    trade(tokenSymbol, Number(payTokenValue), isBuy, leverage, slTpInfos.tpTriggerPrice, slTpInfos.slTriggerPrice);
    
    toast({
      title: `Trade Executed`,
      description: `You have ${isBuy ? "long" : "short"} ${payTokenValue} ${tokenSymbol.name}`,
    });
  };

  return (
    <Form className={className}>
      <div className="rounded-md border border-border bg-card p-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs">Pay</label>
          <span className="text-xs text-muted-foreground">
            Balance: {payTokenBalance}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between bg-transparent">
          <Input
            className="w-full bg-transparent text-lg"
            onChange={updatePayTokenTradeValue}
            placeholder="0.00"
            value={payTokenValue}
          />
          <ChooseTokenButton
            onTokenSymbolChange={onTokenSymbolChange}
            tokenSymbol={payTokenSymbol}
          />
        </div>
      </div>

      <TokenSwapButton onClick={switchTokens} />

      <div className="rounded-md border border-border bg-card p-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs">Long/Short</label>
          <span className="text-xs text-muted-foreground">
            Balance: {ethTokenBalance}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between bg-transparent">
          <Input
            className="w-full bg-transparent text-lg"
            onChange={updateReceiveTokenValue}
            placeholder="0.00"
            value={receiveTokenValue}
          />
          <ChooseTokenButton
            onTokenSymbolChange={onTokenSymbolChange}
            tokenSymbol={"ETH"}
          />
        </div>
      </div>

      <TradeLeverageInput
        className="py-4"
        leverage={leverage}
        setLeverage={setLeverage}
      />

      <SlTpCheckbox
        className="mb-4 cursor-not-allowed"
        slTpInfos={slTpInfos}
        setSlTpInfos={setSlTpInfos}
        orderPrice={ethData.currentPrice}
        qty={parseInt(receiveTokenValue)}
      />

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
          Buy/Long
        </Button>
        <Button
          onClick={() => handleTrade(false)}
          type="submit"
          variant="danger"
        >
          Sell/Short
        </Button>
      </div>
    </Form>
  );
}
