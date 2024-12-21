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
import SwapLimitInput from "./swap-limit-input";
import usePoolData from "@zohal/app/pool/_hooks/use-pool-data";
import { usePrices } from "../_hooks/use-market-data";

export default function LimitSwap({ className }: PropsWithClassName) {
    const [tokenSymbol, setTokenSymbol] = useState<TokenSymbol>("ETH");
    const IntlFormatter = new Intl.NumberFormat();
    const { poolData } = usePoolData();
    const initialRatio = 1;
    const [tokenPrice, setTokenPrice] = useState<number>(0.0);
    const {
        payTokenSymbol,
        payTokenLimitValue,
        receiveTokenSymbol,
        receiveTokenLimitValue,
        pricePerToken,
        tokenRatio,
        setTokenRatio,
        switchTokens,
        updatePayTokenLimitValue,
        updateReceiveTokenLimitValue,
        updateLimitPrice,
    } = useTokenInputs({ ratio: initialRatio, leverage: 0, tokenSymbol: tokenSymbol });
    const { prices } = usePrices();
    const ethData = prices["ETH/USD"];


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
        payTokenLimitValue.length === 0 && receiveTokenLimitValue.length === 0;

    const insufficientBalance = payTokenBalance
        ? parseFloat(payTokenBalance) < parseFloat(payTokenLimitValue)
        : true;

    const onTokenSymbolChange = (_tokenSymbol: TokenSymbol) => switchTokens();

    return (
        <Form className={className}>
            <SwapInput
                formattedTokenBalance={payTokenBalance}
                id="paySwapInput"
                inputValue={payTokenLimitValue}
                label="Pay"
                onInputChange={updatePayTokenLimitValue}
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
                inputValue={receiveTokenLimitValue}
                label="Receive"
                onInputChange={updateReceiveTokenLimitValue}
            >
                <ChooseTokenButton
                    onTokenSymbolChange={onTokenSymbolChange}
                    tokenSymbol={receiveTokenSymbol}
                />
            </SwapInput>

            <SwapLimitInput
                formattedTokenBalance={receiveTokenBalance}
                payTokenSymbol={payTokenSymbol}
                receiveTokenSymbol={receiveTokenSymbol}
                id="PriceLimitSwapInput"
                inputValue={pricePerToken}
                label="Price"
                onInputChange={updateLimitPrice} 
            />

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
                payTokenValue={payTokenLimitValue}
                //@ts-ignore
                oraclePrice={tokenRatio}
            />
        </Form>
    );
}
