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
import { ETH_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from "../../_lib/addresses";
import { useTokenInputs } from "../_hooks/use-token-input";
import  {  usePrices } from "@zohal/app/trade/_hooks/use-market-data";

import { SlTpInfos } from "./sl-tp-modal";
import useTriggerTrade from "../_hooks/use-trigger-trade";
import SlTpDropdownMenu from "./sl-tp-dropdown-menu";
import useFormatNumber from "../_hooks/use-format-number";

export default function TradeTrigger({ className }: PropsWithClassName) {
  const [triggerPrice, setTriggerPrice] = useState("");
  const [slTpInfos, setSlTpInfos] = useState<SlTpInfos>({
    sl: "",
    slTriggerPrice: "",
    size_delta_usd_sl: "",
    collateral_delta_sl: "",
    tp: "",
    tpTriggerPrice: "",
    size_delta_usd_tp: "",
    collateral_delta_tp: ""
  });
  const [checkedLong, setCheckedLong] = useState(false);
  const [checkedShort, setCheckedShort] = useState(false);
  const [tokenSymbol, setTokenSymbol] = useState<TokenSymbol>("ETH");
  const initialRatio = 1;
  const [leverage, setLeverage] = useState(1);
  // const { tokenData: ethData } = usePriceDataSubscription({ pairSymbol: "ETH/USD" });
  // const { tokenData: btcData } = usePriceDataSubscription({ pairSymbol: "BTC/USD" });
  // const { tokenData: strkData } = usePriceDataSubscription({ pairSymbol: "STRK/USD" });
  const { prices } = usePrices();
  const ethData = prices["ETH/USD"];
  const btcData = prices["BTC/USD"];
  const strkData = prices["STRK/USD"];
  const [priceData, setPriceData] = useState(ethData);
  const [slippage, setSlippage] = useState("0.03");
  const {
    payTokenSymbol,
    payTokenValue,
    receiveTokenValue,
    setTokenRatio,
    updateReceiveTokenValue,
    updatePayTokenTradeValue,
    switchTokens,
  } = useTokenInputs({ ratio: initialRatio, leverage: leverage, tokenSymbol: tokenSymbol });
  const { formatNumberWithoutExponent } = useFormatNumber();

  const { marketTokenBalance: payTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens[payTokenSymbol].address,
    decimal: Tokens[payTokenSymbol].decimals,
  });

  const { marketTokenBalance: TokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens[tokenSymbol].address,
    decimal: Tokens[tokenSymbol].decimals,
  });

  const { tradeTrigger } = useTriggerTrade();

  const onTokenSymbolChange = (newTokenSymbol: TokenSymbol) => {
    setTokenSymbol(newTokenSymbol);
    switchTokens();
  };

  const onTriggerPriceChange = (newTriggerPrice: string) => {
    const formattedValue = newTriggerPrice.replace(",", ".");
    if (/^\d*([.]?\d*)$/.test(formattedValue)) {
      setTriggerPrice(formattedValue);
    }
  };

  const onLongTpSlChange = (checked: boolean) => {
    setCheckedShort(false);
    setCheckedLong(checked);
    if (checked === false) {
      setSlTpInfos({
        sl: "",
        slTriggerPrice: "",
        tp: "",
        tpTriggerPrice: "",
        size_delta_usd_sl: "",
        size_delta_usd_tp: "",
        collateral_delta_sl: "",
        collateral_delta_tp: "",
      });
    }
  };

  const onShortTpSlChange = (checked: boolean) => {
    setCheckedLong(false);
    setCheckedShort(checked);
    if (checked === false) {
      setSlTpInfos({
        sl: "",
        slTriggerPrice: "",
        tp: "",
        tpTriggerPrice: "",
        size_delta_usd_sl: "",
        size_delta_usd_tp: "",
        collateral_delta_sl: "",
        collateral_delta_tp: "",
      });
    }
  };


  function onSlippageChange(newSlippage: string) {
    const formattedSlippage = newSlippage.replace(",", ".");
    if (formattedSlippage.length > 4) {
        return;
    }
    if (/^\d*([.]?\d*)$/.test(formattedSlippage)) {
        const numericValue = parseFloat(formattedSlippage);
        if (numericValue <= 100 || isNaN(numericValue)) {
            setSlippage(formattedSlippage);
        }
    }
}

  useEffect(() => {
    let fetchedRatio = 1;
    if (tokenSymbol === "BTC") {
      fetchedRatio = triggerPrice === "" ? btcData.currentPrice : Number(triggerPrice);
      setPriceData(btcData);
    } if (tokenSymbol === "ETH") {
      fetchedRatio = triggerPrice === "" ? ethData.currentPrice : Number(triggerPrice);
      setPriceData(ethData)
    } if (tokenSymbol === "STRK") {
      fetchedRatio = triggerPrice === "" ?  strkData.currentPrice : Number(triggerPrice);
      setPriceData(strkData)
    }
    setTokenRatio(1 / fetchedRatio);
  }, [switchTokens]);

  const priceInfos = [
    { label: "Pool", value: tokenSymbol + "-USDC" },
    { label: "Collateral", value: payTokenValue ? "$" + formatNumberWithoutExponent(Number(payTokenValue)) : "-"},
    { label: "Leverage", value: "" + leverage },
    { label: "Entry Price", value: triggerPrice === "" ? "-" : "$" + formatNumberWithoutExponent(Number(triggerPrice)) },
    { label: "Account Balance", value: "$" + formatNumberWithoutExponent(Number(payTokenBalance)) },

  ];

  const handleTrade = (isBuy: boolean) => {
    tradeTrigger(
      tokenSymbol,
      Number(payTokenValue),
      isBuy,
      leverage,
      Number(triggerPrice),
      slTpInfos.tpTriggerPrice,
      slTpInfos.slTriggerPrice,
      slTpInfos.size_delta_usd_tp,
      slTpInfos.size_delta_usd_sl,
      slTpInfos.collateral_delta_tp,
      slTpInfos.collateral_delta_sl,
      slippage
    );
  };

  return (
    <Form className={className}>
      <div className="rounded-md border border-border bg-secondary p-3">
        <div className="flex items-center justify-between">
          { payTokenValue ?
            <label className="block text-xs">Pay: ${Number(payTokenValue)}</label>
            :
            <label className="block text-xs">Pay</label>
          }          
        <span className="text-xs text-muted-foreground">
          Balance: {formatNumberWithoutExponent(Number(Number(payTokenBalance).toFixed(2)))}
        </span>
        </div>
        <div className="mt-1 flex items-center justify-between bg-transparent">
          <Input
            className="w-full bg-transparent text-lg"
            onChange={updatePayTokenTradeValue}
            placeholder="0.00"
            value={payTokenValue}
            disabled={false}
          />
        <div className=" mt-1 mr-4 justify-between flex items-center gap-1">
          <button
            className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-background mr-1 px-2 py-1 hover:bg-gray-800 transition duration-100"
            onClick={() => updatePayTokenTradeValue(payTokenBalance || "0")}>
              Max
          </button>
          <img alt="USDC" className="h-6 w-6" src={Tokens.USDC.icon} />
            USD
          </div>
        </div>
      </div>

      {/* <TokenSwapButton onClick={switchTokens} /> */}

      <div className="rounded-md border border-border bg-secondary p-3">
        <div className="flex items-center justify-between">
          { payTokenValue ?
            <label className="block text-xs">Long/Short : ${formatNumberWithoutExponent(Number((Number(payTokenValue) * leverage).toFixed(2)))}</label>
            :
            <label className="block text-xs">Long/Short</label>
          }
          <span className="text-xs text-muted-foreground">
            Market Price: {formatNumberWithoutExponent(Number(priceData.currentPrice.toFixed(3)))}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between bg-transparent">
          <Input
            className="w-full bg-transparent text-lg"
            onChange={updateReceiveTokenValue}
            placeholder="0.00"
            value={receiveTokenValue}
            disabled={false}
          />
          <ChooseTokenButton
            onTokenSymbolChange={onTokenSymbolChange}
            tokenSymbol={tokenSymbol}
          />
        </div>
      </div>

      <div className="rounded-md border border-border bg-secondary p-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs">Price</label>
          <span className="text-xs text-muted-foreground">
            Price: {formatNumberWithoutExponent(Number(priceData.currentPrice.toFixed(2)))}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between bg-transparent">
          <Input
            className="w-full bg-transparent text-lg"
            onChange={onTriggerPriceChange}
            placeholder="0.00"
            value={triggerPrice}
            disabled={false}
          />
          <div>
            USD
          </div>
        </div>
      </div>

       <div className="flex items-center justify-between rounded-md border border-neutral-700 p-1">
        <label
          htmlFor="allowedSlippage"
          className="text-sm text-neutral-300 flex-shrink-0 px-2"
        >
          Allowed Slippage
        </label>
        <div className="flex items-center">
          <Input
            className="bg-secondary rounded-md border border-neutral-700 text-lg outline-none text-right w-12"
            id="PricePosition"
            onChange={onSlippageChange}
            placeholder="0.00"
            value={slippage}
            disabled={false}
          />
          <div className="text-lg ml-1">%</div>
        </div>
      </div>

      <TradeLeverageInput
        className="py-4"
        leverage={leverage}
        setLeverage={setLeverage}
      />

<div className="mb-1 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="Long Tp/Sl"
          checked={checkedLong}
          onChange={(e) => onLongTpSlChange(e.target.checked)}
          className="h-4 w-4 cursor-pointer"
        />
        <label htmlFor="limitOrder" className="text-sm text-neutral-300">
          Long TP/SL
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="Short Tp/Sl"
          checked={checkedShort}
          onChange={(e) => onShortTpSlChange(e.target.checked)}
          className="h-4 w-4 cursor-pointer"
        />
        <label htmlFor="limitOrder" className="text-sm text-neutral-300">
          Short TP/SL
        </label>
      </div>

    </div>

    {checkedLong ? 
    <SlTpDropdownMenu
      slTpInfos={slTpInfos}
      setSlTpInfos={setSlTpInfos}
      orderPrice={Number(triggerPrice)}
      qty={Number(receiveTokenValue)}
      isLong={true}
      collateral_delta={payTokenValue}
    /> :
    <></>}

    {checkedShort ? 
    <SlTpDropdownMenu
      slTpInfos={slTpInfos}
      setSlTpInfos={setSlTpInfos}
      orderPrice={Number(triggerPrice)}
      qty={Number(receiveTokenValue)}
      isLong={false}
      collateral_delta={payTokenValue}
    /> :
    <></>}
    

      <div className="flex flex-col gap-2 rounded-md border border-border p-3">
        {priceInfos.map((priceInfo, index) => (
          <PriceInfo key={index} {...priceInfo} />
        ))}
      </div>

      <div className="mb-8 mt-4 grid w-full items-center gap-2">
        {checkedLong ? (
          <Button
            className="w-full"
            onClick={() => handleTrade(true)}
            type="submit"
            variant="success"
          >
            Open Long
          </Button>
        ) : checkedShort ? (
          <Button
            className="w-full"
            onClick={() => handleTrade(false)}
            type="submit"
            variant="danger"
          >
            Open Short
          </Button>
        ) : (
          <>
            <div className="mb-8 mt-4 grid w-full grid-cols-2 items-center gap-2">
              <Button
                onClick={() => handleTrade(true)}
                type="submit"
                variant="success"
              >
                Open Long
              </Button>
              <Button
                onClick={() => handleTrade(false)}
                type="submit"
                variant="danger"
              >
                Open Short
              </Button>
            </div>
          </>
        )}
      </div>
    </Form>
  );
}
