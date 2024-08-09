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

import useEthPrice from "@zohal/app/trade/_hooks/use-market-data";
import usePoolData from "@zohal/app/pool/_hooks/use-pool-data";


export default function MarketSwap({ className }: PropsWithClassName) {
  const { poolData } = usePoolData();
  const [tokenPrice, setTokenPrice] = useState<number>(0.0);
  const [tokenRatio, setTokenRatio] = useState<number>(0);
  const {
    payTokenSymbol,
    payTokenValue,
    receiveTokenSymbol,
    receiveTokenValue,
    switchTokens,
    updatePayTokenValue,
    updateReceiveTokenValue,
  } = useTokenInputs({ ratio: tokenRatio, leverage:1 });

  const { ethData } = useEthPrice();

  console.log("receiveTokenValue",receiveTokenValue)

  const fetchPrice = async (token: any) => {
    const pair = token+"/usd";
    const apiUrl = `/api/fetch-price?pair=${pair}`;
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        let price = data.price; 
        const decimal = data.decimals;
        price = parseInt(price, 16) / 10 ** decimal;
        console.log("Price fetched for " + token + ":", price);
        setTokenPrice(price);
      }
    } catch (error) {
      console.error("Error fetching price " + token +":", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchedRatio = ethData.currentPrice;
    setTokenRatio(payTokenSymbol === "USDC" ? 1 / fetchedRatio : fetchedRatio);
    fetchPrice(payTokenSymbol)
  }, [switchTokens]);


  const { marketTokenBalance: payTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens[payTokenSymbol].address,
    decimal: Tokens[payTokenSymbol].decimals
  });

  const { marketTokenBalance: receiveTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens[receiveTokenSymbol].address,
    decimal: Tokens[payTokenSymbol].decimals
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

            {poolData && (
          <SwapMoreInformations
          payTokenSymbol={payTokenSymbol}
          ratio={tokenRatio}
          price={payTokenSymbol !== "USDC" ? tokenPrice : 1}
          receiveTokenSymbol={receiveTokenSymbol}
          //@ts-ignore
          liquidity={IntlFormatter.format(Number(poolData.pool_value))}
        />
        )
      }
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