"use client";

import useMint from "@zohal/app/_hooks/use-mint";

export function FaucetButton() {
  const {mint} = useMint(); 
  return (
    <button   onClick={mint} className="flex h-10 items-center rounded-xl bg-secondary px-4 transition-colors hover:bg-neutral-800"> Faucet </button>
  );
}
