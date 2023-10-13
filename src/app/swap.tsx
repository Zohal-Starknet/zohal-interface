"use client";
import Fieldset from "./ui/fieldset";
import Input from "./ui/input";
import SwapMoreInformations from "./components/swap/more-informations";
import TokenSwapButton from "./ui/form/token-swap-button";
import Form from "./ui/form/form";
import Button from "./ui/button";

export default function Swap() {
  return (
    <Form>
      <Fieldset label="Pay" field={<Input placeholder="0.00" />} />

      <TokenSwapButton />

      <Fieldset label="Receive" field={<Input placeholder="0.00" />} />

      <SwapMoreInformations />

      <Button type="submit" variant="primary" className="mt-8">
        Connect Wallet
      </Button>
    </Form>
  );
}
