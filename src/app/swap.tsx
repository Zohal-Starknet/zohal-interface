"use client";
import { useAccount, useBalance } from "@starknet-react/core";

import SwapMoreInformations from "./components/swap/more-informations";
import { useTokenInputs } from "./hooks/use-token-input";
import SwapActionButton from "./swap-action-button";
import Fieldset from "./ui/fieldset";
import Form from "./ui/form/form";
import TokenSwapButton from "./ui/form/token-swap-button";
import Input from "./ui/input";

/**
 * TODO @YohanTz - Use big numbers for calculations
 */
export default function Swap() {
  const ethBtcRatio = 0.055;

  const { address } = useAccount();

  const { data: balance } = useBalance({ address });

  const {
    payTokenSymbol,
    payTokenValue,
    receiveTokenSymbol,
    receiveTokenValue,
    switchTokens,
    updatePayTokenValue,
    updateReceiveTokenValue,
  } = useTokenInputs({ ratio: ethBtcRatio });

  const noEnteredAmount =
    payTokenValue.length === 0 && receiveTokenValue.length === 0;

  const insufficientBalance = balance
    ? parseFloat(balance.formatted) < parseFloat(payTokenValue)
    : true;

  return (
    <Form>
      {payTokenSymbol}
      <Fieldset
        field={
          <Input
            onChange={updatePayTokenValue}
            placeholder="0.00"
            value={payTokenValue}
          />
        }
        label="Pay"
      />

      <TokenSwapButton onClick={switchTokens} />

      {receiveTokenSymbol}
      <Fieldset
        field={
          <Input
            onChange={updateReceiveTokenValue}
            placeholder="0.00"
            value={receiveTokenValue}
          />
        }
        label="Receive"
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
      />
    </Form>
  );
}
