"use client";
import { useAccount, useBalance } from "@starknet-react/core";
import { Tokens } from "@zohal/app/_helpers/tokens";
import useMarketTokenBalance from "@zohal/app/_hooks/use-market-token-balance";
import { type PropsWithClassName } from "@zohal/app/_lib/utils";

import Form from "../../_ui/form";
import { useTokenInputs } from "../_hooks/use-token-input";
import SwapMoreInformations from "./more-informations";
import SwapActionButton from "./swap-action-button";
import SwapInput from "./swap-input";
import TokenSwapButton from "./token-swap-button";

/**
 * TODO @YohanTz - Use big numbers for calculations
 */
export default function Swap({ className }: PropsWithClassName) {

  
  const ethUsdcRatio = 7000;

  const { address } = useAccount();

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

  // TODO @YohanTz
  const insufficientBalance = payTokenBalance
    ? parseFloat(payTokenBalance) < parseFloat(payTokenValue)
    : true;

  return (
    <Form className={className}>
      <SwapInput
        // formattedTokenBalance={payTokenBalance?.formatted}
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
        // formattedTokenBalance={receiveTokenBalance?.formatted}
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
      />
    </Form>
  );
}
