"use client";

import { TokenSymbol, Tokens } from "@zohal/app/_helpers/tokens";
import useMarketTokenBalance from "@zohal/app/_hooks/use-market-token-balance";
import { type PropsWithClassName } from "@zohal/app/_lib/utils";
import { useEffect, useState } from "react";

import Button from "../../_ui/button";
import Form from "../../_ui/form";
import Input from "../../_ui/input";
import useMarketTrade from "../_hooks/use-market-trade";
import ChooseTokenButton from "./choose-token-button";
import PriceInfo from "./price-info";
import TradeLeverageInput from "./trade-leverage-input";
import { useTokenInputs } from "../_hooks/use-token-input";
import useEthPrice, { usePriceDataSubscription } from "@zohal/app/trade/_hooks/use-market-data";

import { SlTpInfos } from "./sl-tp-modal";
import { useToast } from "@zohal/app/_ui/use-toast";
import SlTpDropdownMenu from "./sl-tp-dropdown-menu";
import useFormatNumber from "../_hooks/use-format-number";
import PriceInfoFees from "./price-info-fees";

export default function Trade({ className }: PropsWithClassName) {
  const [tokenSymbol, setTokenSymbol] = useState<TokenSymbol>("ETH");
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
  const [slippage, setSlippage] = useState("0.03");
  const [checkedLong, setCheckedLong] = useState(false);
  const [checkedShort, setCheckedShort] = useState(false);
  const initialRatio = 1;
  const [leverage, setLeverage] = useState(1);
  const { tokenData: ethData } = usePriceDataSubscription({ pairSymbol: "ETH/USD" });
  const { tokenData: btcData } = usePriceDataSubscription({ pairSymbol: "BTC/USD" });
  const { tokenData: strkData } = usePriceDataSubscription({ pairSymbol: "STRK/USD" });
  const [priceData, setPriceData] = useState(ethData);
  const {
    payTokenSymbol,
    payTokenValue,
    receiveTokenValue,
    setTokenRatio,
    updateReceiveTokenValue,
    updatePayTokenTradeValue,
    switchTokens,
  } = useTokenInputs({
    ratio: initialRatio,
    leverage: leverage,
    tokenSymbol: tokenSymbol,
  });
  const { formatNumberWithoutExponent } = useFormatNumber();

  const { marketTokenBalance: payTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens[payTokenSymbol].address,
    decimal: Tokens[payTokenSymbol].decimals,
  });

  const { marketTokenBalance: TokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens[tokenSymbol].address,
    decimal: Tokens[tokenSymbol].decimals,
  });

  const { trade } = useMarketTrade();
  const { toast } = useToast();

  const onTokenSymbolChange = (newTokenSymbol: TokenSymbol) => {
    setTokenSymbol(newTokenSymbol);
    switchTokens();
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
      fetchedRatio = btcData.currentPrice;
      setPriceData(btcData);
    }
    if (tokenSymbol === "ETH") {
      fetchedRatio = ethData.currentPrice;
      setPriceData(ethData);
    }
    if (tokenSymbol === "STRK") {
      fetchedRatio = strkData.currentPrice;
      setPriceData(strkData);
    }
    setTokenRatio(1 / fetchedRatio);
  }, [switchTokens]);

  const priceInfos = [
    { label: "Market", value: tokenSymbol + "-USDC" },
    { label: "Leverage", value: "" + leverage + "x" },
    { label: "Collateral", value: payTokenValue ? "$" + formatNumberWithoutExponent(Number(payTokenValue)) : "-"},
    { label: "Entry Price", value: "$" + formatNumberWithoutExponent(Number(priceData.currentPrice.toFixed(2))) },
    { label: "Liq. Price For Long", value: priceData && payTokenValue != "" && receiveTokenValue != "" ? "$" + formatNumberWithoutExponent(Number((priceData.currentPrice - (Number(payTokenValue) / Number(receiveTokenValue))).toFixed(2))) : "-"},
    { label: "Liq. Price For Short", value: priceData && payTokenValue != "" && receiveTokenValue != "" ? "$" + formatNumberWithoutExponent(Number((priceData.currentPrice + (Number(payTokenValue) / Number(receiveTokenValue))).toFixed(2))) : "-"},
    { label: "Account Balance", value: "$" + formatNumberWithoutExponent(Number(payTokenBalance)) },
    { label: "Fees", value: "-$1,234.21"},
  ];
  
  const priceInfosFees = [
    {label: "Fees", value: "-1,234.21", hover_value: "0.050% of position size"}
  ];

  const handleTrade = (isBuy: boolean) => {
    console.log("slTpInfos", slTpInfos);
    trade(
      tokenSymbol,
      Number(payTokenValue),
      isBuy,
      leverage,
      slTpInfos.tpTriggerPrice,
      slTpInfos.slTriggerPrice,
      slTpInfos.size_delta_usd_tp,
      slTpInfos.size_delta_usd_sl,
      slTpInfos.collateral_delta_tp,
      slTpInfos.collateral_delta_sl,
      priceData,
      slippage
    );

    toast({
      title: `Trade Executed`,
      description: `You have ${isBuy ? "long" : "short"} ${payTokenValue} ${Tokens[tokenSymbol].name}`,
    });
  };

  return (
    <Form className={className}>
      <div className="rounded-md border border-border bg-secondary p-3">
        <div className="flex items-center justify-between">
          {payTokenValue ? (
            <label className="block text-xs">
              Pay: ${formatNumberWithoutExponent(Number(payTokenValue))}
            </label>
          ) : (
            <label className="block text-xs">Pay</label>
          )}
          <span className="text-xs text-muted-foreground">
            Balance: {formatNumberWithoutExponent(Number(payTokenBalance))}
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
          <div className="mr-4 mt-1 flex items-center gap-1">
            <button 
              className="mr-1 flex flex-shrink-0 items-center gap-2 rounded-lg bg-background px-2 py-1 transition duration-100 hover:bg-gray-800"
              onClick={() => updatePayTokenTradeValue(payTokenBalance || "0")}>
              Max
            </button>
            <img alt="USDC" className="h-6 w-6" src={Tokens.USDC.icon} />
            USD
          </div>
        </div>
      </div>
      <div className="rounded-md border border-border bg-secondary p-3">
        <div className="flex items-center justify-between">
          {payTokenValue ? (
            <label className="block text-xs">
              Long/Short : ${formatNumberWithoutExponent(Number(payTokenValue) * leverage)}
            </label>
          ) : (
            <label className="block text-xs">Long/Short</label>
          )}
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
        className="py-2"
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
      {checkedLong ? (
        <SlTpDropdownMenu
          slTpInfos={slTpInfos}
          setSlTpInfos={setSlTpInfos}
          orderPrice={priceData.currentPrice}
          qty={Number(receiveTokenValue)}
          isLong={true}
          collateral_delta={payTokenValue}
        />
      ) : (
        <></>
      )}
      {checkedShort ? (
        <SlTpDropdownMenu
          slTpInfos={slTpInfos}
          setSlTpInfos={setSlTpInfos}
          orderPrice={priceData.currentPrice}
          qty={Number(receiveTokenValue)}
          isLong={false}
          collateral_delta={payTokenValue}
        />
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-2 rounded-md border border-border p-3">
        {priceInfos.map((priceInfo, index) => (
          <PriceInfo key={index} {...priceInfo} />
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-md border border-border p-3">
        {priceInfosFees.map((priceInfo, index) => (
          <PriceInfoFees key={index} {...priceInfo} />
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
