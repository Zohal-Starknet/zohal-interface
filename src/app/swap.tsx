"use client";
import { useAccount, useBalance } from "@starknet-react/core";
import { useRef, useState } from "react";

import SwapMoreInformations from "./components/swap/more-informations";
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
  // TODO: Type this state stronger than string
  const [payTokenSymbol, setPayTokenSymbol] = useState("ETH");
  const [payTokenValue, setPayTokenValue] = useState("");

  // TODO: Type this state stronger than string
  const [receiveTokenSymbol, setReceiveTokenSymbol] = useState("BTC");
  const [receiveTokenValue, setReceiveTokenValue] = useState("");

  const temporaryPayTokenValueRef = useRef("");
  const temporaryPayTokenSymbolRef = useRef("");

  const { address } = useAccount();

  const { data: balance } = useBalance({ address });

  const noEnteredAmount =
    payTokenValue.length === 0 && receiveTokenValue.length === 0;

  const insufficientBalance = balance
    ? parseFloat(balance.formatted) < parseFloat(payTokenValue)
    : true;

  function updatePayTokenValue(tokenValue: string) {
    setPayTokenValue(tokenValue);
    setReceiveTokenValue(
      tokenValue !== ""
        ? (parseFloat(tokenValue) * ethBtcRatio).toString()
        : "",
    );
  }

  function updateReceiveTokenValue(tokenValue: string) {
    setReceiveTokenValue(tokenValue);
    setPayTokenValue(
      tokenValue !== ""
        ? (parseFloat(tokenValue) / ethBtcRatio).toString()
        : "",
    );
  }

  function switchTokens() {
    temporaryPayTokenValueRef.current = payTokenValue;
    setPayTokenValue(receiveTokenValue);
    setReceiveTokenValue(temporaryPayTokenValueRef.current);

    temporaryPayTokenSymbolRef.current = payTokenSymbol;
    setPayTokenSymbol(receiveTokenSymbol);
    setReceiveTokenSymbol(temporaryPayTokenSymbolRef.current);
  }

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
