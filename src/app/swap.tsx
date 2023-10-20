"use client";
import Fieldset from "./ui/fieldset";
import Input from "./ui/input";
import SwapMoreInformations from "./components/swap/more-informations";
import TokenSwapButton from "./ui/form/token-swap-button";
import Form from "./ui/form/form";
import Button from "./ui/button";
import { useState } from "react";
import { useConnectModal } from "./zohal-modal";
import { useAccount, useBalance } from "@starknet-react/core";

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

  const { openConnectModal } = useConnectModal();

  const { address } = useAccount();

  const { data: balance } = useBalance({ address });

  const hasAmountBeenEntered =
    payTokenValue.length > 0 && receiveTokenValue.length > 0;

  const sufficientBalance = balance
    ? parseFloat(balance.formatted) > parseFloat(payTokenValue)
    : false;

  function updatePayTokenValue(tokenValue: string) {
    setPayTokenValue(tokenValue);
    setReceiveTokenValue((parseFloat(tokenValue) * ethBtcRatio).toString());
  }

  function updateReceiveTokenValue(tokenValue: string) {
    setReceiveTokenValue(tokenValue);
    setPayTokenValue((parseFloat(tokenValue) / ethBtcRatio).toString());
  }

  function switchSwapDirection() {
    // TODO: Switch selected token too
    setPayTokenValue((prevReceiveTokenValue) => {
      setPayTokenValue(receiveTokenValue);
      setReceiveTokenValue(prevReceiveTokenValue);

      return receiveTokenValue;
    });

    setPayTokenSymbol((prevReceiveTokenSymbol) => {
      setPayTokenSymbol(receiveTokenSymbol);
      setReceiveTokenSymbol(prevReceiveTokenSymbol);

      return receiveTokenSymbol;
    });
  }

  return (
    <Form>
      {payTokenSymbol}
      <Fieldset
        label="Pay"
        field={
          <Input
            placeholder="0.00"
            value={payTokenValue}
            onChange={updatePayTokenValue}
          />
        }
      />

      <TokenSwapButton onClick={switchSwapDirection} />

      {receiveTokenSymbol}
      <Fieldset
        label="Receive"
        field={
          <Input
            placeholder="0.00"
            value={receiveTokenValue}
            onChange={updateReceiveTokenValue}
          />
        }
      />

      <SwapMoreInformations
        ratio={ethBtcRatio}
        payTokenSymbol={payTokenSymbol}
        receiveTokenSymbol={receiveTokenSymbol}
      />

      {openConnectModal ? (
        <Button
          type="submit"
          variant="primary"
          className="mt-8"
          onClick={openConnectModal}
        >
          Connect Wallet
        </Button>
      ) : !hasAmountBeenEntered ? (
        <Button className="mt-8">Enter an amount</Button>
      ) : !sufficientBalance ? (
        <Button className="mt-8">Insufficient {payTokenSymbol} balance</Button>
      ) : (
        <Button className="mt-8">Swap</Button>
      )}
    </Form>
  );
}
