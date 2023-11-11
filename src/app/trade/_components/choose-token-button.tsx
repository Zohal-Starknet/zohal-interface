import { TOKENS, type TokenSymbol } from "@zohal/app/_helpers/tokens";
import Button from "@zohal/app/_ui/button";
import { ChevronRight } from "@zohal/app/_ui/icons";
import { useState } from "react";

import ChooseTokenModal from "./choose-token-modal";

type ChooseTokenButtonProps = {
  onTokenSymbolChange: (newTokenSymbol: TokenSymbol) => void;
  tokenSymbol: TokenSymbol;
};

export default function ChooseTokenButton(props: ChooseTokenButtonProps) {
  const { onTokenSymbolChange, tokenSymbol } = props;

  const [open, setOpen] = useState(false);

  const token = TOKENS[tokenSymbol];

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <>
      <button
        className="flex flex-shrink-0 items-center gap-2 rounded-full border border-[#363636] bg-[#1b1d22] p-[0.3125rem]"
        onClick={openModal}
      >
        <img alt={`${token.name} icon`} className="h-6 w-6" src={token.icon} />
        {tokenSymbol}
        <ChevronRight className="rotate-90" label="chevron" />
      </button>
      <ChooseTokenModal
        onTokenSymbolChange={(newTokenSymbol) => {
          onTokenSymbolChange(newTokenSymbol);
          closeModal();
        }}
        onOpenChange={setOpen}
        open={open}
        tokenSymbol={tokenSymbol}
      />
    </>
  );
}
