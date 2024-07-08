import { type TokenSymbol, Tokens } from "@zohal/app/_helpers/tokens";
import { ChevronRight } from "@zohal/app/_ui/icons";
import { useState } from "react";

import ChooseTokenModal from "./choose-token-modal";

type ChooseTokenButtonProps = {
  /** Function called on token change */
  onTokenSymbolChange: (newTokenSymbol: TokenSymbol) => void;
  /** Symbol of the selected token */
  tokenSymbol: TokenSymbol;
};

export default function ChooseTokenButton(props: ChooseTokenButtonProps) {
  const { onTokenSymbolChange, tokenSymbol } = props;

  const [open, setOpen] = useState(false);

  const token = Tokens[tokenSymbol];

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <>
      <button
        className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-background p-1"
        onClick={openModal}
      >
        <img alt={`${token.name} icon`} className="h-6 w-6" src={token.icon} />
        {tokenSymbol}
        <ChevronRight className="rotate-90" label="chevron" />
      </button>
      <ChooseTokenModal
        onOpenChange={setOpen}
        onTokenSymbolChange={(newTokenSymbol) => {
          onTokenSymbolChange(newTokenSymbol);
          closeModal();
        }}
        open={open}
        tokenSymbol={tokenSymbol}
      />
    </>
  );
}
