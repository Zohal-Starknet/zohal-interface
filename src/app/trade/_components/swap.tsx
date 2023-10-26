"use client";
import { useAccount, useBalance } from "@starknet-react/core";

import Fieldset from "../../_ui/fieldset";
import Form from "../../_ui/form";
import Input from "../../_ui/input";
import { useTokenInputs } from "../_hooks/use-token-input";
import SwapMoreInformations from "./more-informations";
import SwapActionButton from "./swap-action-button";
import TokenSwapButton from "./token-swap-button";

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
