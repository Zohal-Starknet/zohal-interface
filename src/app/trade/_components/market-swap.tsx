"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { TokenSymbol, Tokens } from "@zohal/app/_helpers/tokens";
import useMarketTokenBalance from "@zohal/app/_hooks/use-market-token-balance";
import { PropsWithClassName } from "@zohal/app/_lib/utils";
import Form from "../../_ui/form";
import { useTokenInputs } from "../_hooks/use-token-input";
import SwapMoreInformations from "./more-informations";
import SwapActionButton from "./swap-action-button";
import SwapInput from "./swap-input";
import TokenSwapButton from "./token-swap-button";
import ChooseTokenButton from "./choose-token-button";
import useEthPrice, { usePriceDataSubscription } from "@zohal/app/trade/_hooks/use-market-data";

// import usePoolData from "@zohal/app/pool/_hooks/use-pool-data";

export default function MarketSwap({ className }: PropsWithClassName) {
  // const { poolData } = usePoolData();
  const initialRatio = 1;
  const [tokenSymbol, setTokenSymbol] = useState<TokenSymbol>("ETH");
  const {
    payTokenSymbol,
    payTokenValue,
    receiveTokenSymbol,
    receiveTokenValue,
    tokenRatio,
    setTokenRatio,
    switchTokens,
    updatePayTokenValue,
    updateReceiveTokenValue,
  } = useTokenInputs({ ratio: initialRatio, leverage: 0, tokenSymbol: tokenSymbol });
  const { tokenData: ethData } = usePriceDataSubscription({ pairSymbol: "ETH/USD" });
  const { tokenData: btcData } = usePriceDataSubscription({ pairSymbol: "BTC/USD" });
  const { tokenData: strkData } = usePriceDataSubscription({ pairSymbol: "STRK/USD" });
  const [priceData, setPriceData] = useState(ethData);

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


  const { marketTokenBalance: payTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens[payTokenSymbol].address,
    decimal: Tokens[payTokenSymbol].decimals
  });

  const { marketTokenBalance: receiveTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens[receiveTokenSymbol].address,
    decimal: Tokens[receiveTokenSymbol].decimals
  });


  const noEnteredAmount =
    payTokenValue.length === 0 && receiveTokenValue.length === 0;

  const insufficientBalance = payTokenBalance
    ? parseFloat(payTokenBalance) < parseFloat(payTokenValue)
    : true;

  const onTokenSymbolChange = (_tokenSymbol: TokenSymbol) => switchTokens();
  const IntlFormatter = new Intl.NumberFormat();

  return (
    <Form className={className}>
      <SwapInput
        formattedTokenBalance={payTokenBalance}
        id="paySwapInput"
        inputValue={payTokenValue}
        label="Pay"
        onInputChange={updatePayTokenValue}
      >
        <ChooseTokenButton
          onTokenSymbolChange={onTokenSymbolChange}
          tokenSymbol={payTokenSymbol}
        />
      </SwapInput>

      <TokenSwapButton onClick={switchTokens} />

      <SwapInput
        formattedTokenBalance={receiveTokenBalance}
        id="receiveSwapInput"
        inputValue={receiveTokenValue}
        label="Receive"
        onInputChange={updateReceiveTokenValue}
      >
        <ChooseTokenButton
          onTokenSymbolChange={onTokenSymbolChange}
          tokenSymbol={receiveTokenSymbol}
        />
      </SwapInput>

      {/* {poolData && (
          <SwapMoreInformations
          payTokenSymbol={payTokenSymbol}
          ratio={tokenRatio}
          price={payTokenSymbol !== "USDC" ? tokenPrice : 1}
          receiveTokenSymbol={receiveTokenSymbol}
          //@ts-ignore
          liquidity={IntlFormatter.format(Number(poolData.pool_value))}
        />
        )
      } */}

      <SwapActionButton
        insufficientBalance={insufficientBalance}
        noEnteredAmount={noEnteredAmount}
        payTokenSymbol={payTokenSymbol}
        payTokenValue={payTokenValue}
        //@ts-ignore
        oraclePrice={tokenRatio}
      />
    </Form>
    );
}
