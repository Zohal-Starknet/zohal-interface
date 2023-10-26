"use client";
import SwapMoreInformations from "./components/swap/more-informations";
import Button from "./ui/button";
import Fieldset from "./ui/fieldset";
import Form from "./ui/form/form";
import TokenSwapButton from "./ui/form/token-swap-button";
import Input from "./ui/input";

export default function Swap() {
  return (
    <Form>
      <Fieldset field={<Input placeholder="0.00" />} label="Pay" />

      <TokenSwapButton />

      <Fieldset field={<Input placeholder="0.00" />} label="Receive" />

      <SwapMoreInformations />

      <Button className="mt-8" type="submit">
        Connect Wallet
      </Button>
    </Form>
  );
}
