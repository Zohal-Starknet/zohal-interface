"use client";
import { useAccount, useBalance } from "@starknet-react/core";
import { TOKENS } from "@zohal/app/_helpers/tokens";

import Form from "../../_ui/form";
import { useTokenInputs } from "../_hooks/use-token-input";
import SwapMoreInformations from "./more-informations";
import SwapActionButton from "./swap-action-button";
import SwapInput from "./swap-input";
import TokenSwapButton from "./token-swap-button";

/**
 * TODO @YohanTz - Use big numbers for calculations
 */
export default function Swap() {
  const ethBtcRatio = 0.055;

  const { address } = useAccount();

  const {
    payTokenSymbol,
    payTokenValue,
    receiveTokenSymbol,
    receiveTokenValue,
    switchTokens,
    updatePayTokenValue,
    updateReceiveTokenValue,
  } = useTokenInputs({ ratio: ethBtcRatio });

  const { data: payTokenBalance } = useBalance({
    address,
    token: TOKENS[payTokenSymbol].address,
  });
  const { data: receiveTokenBalance } = useBalance({
    address,
    token: TOKENS[receiveTokenSymbol].address,
  });

  const noEnteredAmount =
    payTokenValue.length === 0 && receiveTokenValue.length === 0;

  const insufficientBalance = payTokenBalance
    ? parseFloat(payTokenBalance.formatted) < parseFloat(payTokenValue)
    : true;

  return (
    <Form>
      <SwapInput
        formattedTokenBalance={payTokenBalance?.formatted}
        id="paySwapInput"
        inputValue={payTokenValue}
        label="Pay"
        onInputChange={updatePayTokenValue}
        tokenSymbol={payTokenSymbol}
      />

      <TokenSwapButton onClick={switchTokens} />

      <SwapInput
        formattedTokenBalance={receiveTokenBalance?.formatted}
        id="receiveSwapInput"
        inputValue={receiveTokenValue}
        label="Receive"
        onInputChange={updateReceiveTokenValue}
        tokenSymbol={receiveTokenSymbol}
      />

      <SwapMoreInformations
        payTokenSymbol={payTokenSymbol}
        ratio={ethBtcRatio}
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
