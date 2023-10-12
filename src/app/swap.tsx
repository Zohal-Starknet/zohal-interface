"use client";
import Fieldset from "./ui/fieldset";
import Input from "./ui/input";
import { SwapIcon } from "./ui/icons";
import SwapMoreInformations from "./components/swap/more-informations";

export default function Swap() {
  return (
    <form
      className="pt-4 flex flex-col gap-1.5 h-full"
      // TODO - Handle correctly Submit event
      onSubmit={(event) => event.preventDefault()}
    >
      <Fieldset label="Pay" field={<Input />} />

      <div className="relative flex items-center justify-center">
        <button
          type="button"
          className="mx-auto absolute p-2 bg-[#4b4f5d] rounded-full"
        >
          <SwapIcon label="Swap" className="w-5 h-5 text-white" />
        </button>
      </div>

      <Fieldset label="Receive" field={<Input />} />

      <SwapMoreInformations />

      <button
        type="submit"
        className="bg-[#4681f4] mt-auto p-2 rounded-md justify-self-end"
      >
        Connect Wallet
      </button>
    </form>
  );
}
