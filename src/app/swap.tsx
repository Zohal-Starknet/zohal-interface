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
      <Fieldset field={<Input />} label="Pay" />

      <TokenSwapButton />

      <Fieldset field={<Input />} label="Receive" />

      <SwapMoreInformations />

      <Button className="mt-auto" type="submit" variant="primary">
        Connect Wallet
      </Button>
    </Form>
  );
}
