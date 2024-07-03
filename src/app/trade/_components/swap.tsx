"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { Tokens } from "@zohal/app/_helpers/tokens";
import useMarketTokenBalance from "@zohal/app/_hooks/use-market-token-balance";
import { PropsWithClassName } from "@zohal/app/_lib/utils";

import Form from "../../_ui/form";
import { useTokenInputs } from "../_hooks/use-token-input";
import SwapMoreInformations from "./more-informations";
import SwapActionButton from "./swap-action-button";
import SwapInput from "./swap-input";
import TokenSwapButton from "./token-swap-button";

export default function Swap({ className }: PropsWithClassName) {
  const [ethUsdcRatio, setEthUsdcRatio] = useState<number>(0);

  const { address } = useAccount();

  const fetchEthUsdcRatio= async() =>  {
    const pair = "eth/usd";
    const apiUrl = `/api/fetch-candlestick?pair=${pair}`;
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        const latestPrice = data.data[data.data.length - 1].close;
        setEthUsdcRatio(latestPrice/10**8);
      }
    } catch (error) {
      console.error("Error fetching ETH/USDC ratio:", error);
      throw error;
    }
  }

  useEffect(() => {
    fetchEthUsdcRatio();
    const intervalId = setInterval(fetchEthUsdcRatio, 15 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const {
    payTokenSymbol,
    payTokenValue,
    receiveTokenSymbol,
    receiveTokenValue,
    switchTokens,
    updatePayTokenValue,
    updateReceiveTokenValue,
  } = useTokenInputs({ ratio: ethUsdcRatio });

  const { marketTokenBalance: payTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens[payTokenSymbol].address,
  });

  const { marketTokenBalance: receiveTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens[receiveTokenSymbol].address,
  });

  const noEnteredAmount =
    payTokenValue.length === 0 && receiveTokenValue.length === 0;

  const insufficientBalance = payTokenBalance
    ? parseFloat(payTokenBalance) < parseFloat(payTokenValue)
    : true;

  return (
    <Form className={className}>
      <SwapInput
        formattedTokenBalance={payTokenBalance}
        id="paySwapInput"
        inputValue={payTokenValue}
        label="Pay"
        onInputChange={updatePayTokenValue}
        onTokenSymbolChange={(_tokenSymbol) => switchTokens()}
        tokenSymbol={payTokenSymbol}
      />

      <TokenSwapButton onClick={switchTokens} />

      <SwapInput
        formattedTokenBalance={receiveTokenBalance}
        id="receiveSwapInput"
        inputValue={receiveTokenValue}
        label="Receive"
        onInputChange={updateReceiveTokenValue}
        onTokenSymbolChange={(_tokenSymbol) => switchTokens()}
        tokenSymbol={receiveTokenSymbol}
      />

      <SwapMoreInformations
        payTokenSymbol={payTokenSymbol}
        ratio={ethUsdcRatio}
        receiveTokenSymbol={receiveTokenSymbol}
      />

      <SwapActionButton
        insufficientBalance={insufficientBalance}
        noEnteredAmount={noEnteredAmount}
        payTokenSymbol={payTokenSymbol}
        payTokenValue={payTokenValue}
         //@ts-ignore
        oraclePrice={ethUsdcRatio}
      />
    </Form>
  );
}
