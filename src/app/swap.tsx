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
      <Fieldset label="Pay" field={<Input />} />

      <TokenSwapButton />

      <Fieldset label="Receive" field={<Input />} />

      <SwapMoreInformations />

      <Button
        type="submit"
        className="mt-auto p-2 rounded-md justify-self-end"
        label="Connect Wallet"
      />
    </Form>
  );
}
