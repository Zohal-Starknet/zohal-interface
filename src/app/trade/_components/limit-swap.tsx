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

export default function LimitSwap({ className }: PropsWithClassName) {
    const IntlFormatter = new Intl.NumberFormat();
    const { poolData } = usePoolData();
    const [tokenRatio, setTokenRatio] = useState<number>(0);
    const [tokenPrice, setTokenPrice] = useState<number>(0.0);
    const {
        payTokenSymbol,
        payTokenValue,
        receiveTokenSymbol,
        receiveTokenValue,
        switchTokens,
        updatePayTokenValue,
        updateReceiveTokenValue,
      } = useTokenInputs({ ratio: tokenRatio, leverage:1 });


    const fetchEthUsdcRatio = async () => {
        const pair = "eth/usd";
        const apiUrl = `/api/fetch-candlestick?pair=${pair}`;
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                const latestPrice = data.data[data.data.length - 1].close;
                const fetchedRatio = latestPrice / 10 ** 8;
                setTokenRatio(payTokenSymbol === "USDC" ? 1 / fetchedRatio : fetchedRatio);
            }
        } catch (error) {
            console.error("Error fetching ETH/USDC ratio:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchEthUsdcRatio();
        const intervalId = setInterval(fetchEthUsdcRatio, 15 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);


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

            <SwapLimitInput
                formattedTokenBalance={receiveTokenBalance}
                payTokenSymbol={payTokenSymbol}
                receiveTokenSymbol={receiveTokenSymbol}
                id="PriceLimitSwapInput"
                inputValue={receiveTokenValue}
                label="Price"
                onInputChange={updateReceiveTokenValue}
            >
            </SwapLimitInput>

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
