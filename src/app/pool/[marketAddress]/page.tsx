"use client";

import { Markets } from "@zohal/app/_helpers/markets";
import { Tokens } from "@zohal/app/_helpers/tokens";
import useMarketTokenBalance from "@zohal/app/_hooks/use-market-token-balance";
import Input from "@zohal/app/_ui/input";
import Tabs, { type TabItemType } from "@zohal/app/_ui/tabs";
import { notFound } from "next/navigation";
import { useState } from "react";

import useDeposit from "./_hooks/use-deposit";
import useWithdraw from "./_hooks/use-withdraw";

interface MarketPageProps {
  params: {
    marketAddress: `0x${string}`;
  };
}

function BuyGm() {
  const { deposit } = useDeposit();
  const [ethInputValue, setEthInputValue] = useState("");
  const [usdcInputValue, setUsdcInputValue] = useState("");

  const { marketTokenBalance: ethTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens.ETH.address,
  });

  const { marketTokenBalance: usdcTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens.USDC.address,
  });

  return (
    <div className="mt-4 flex flex-col gap-2 px-4">
      <div className="flex items-end justify-between">
        <p>ETH</p>
        <p className="text-sm text-neutral-300">Balance: {ethTokenBalance}</p>
      </div>
      <Input
        className="text-md rounded-lg border border-[#363636] bg-transparent px-3 py-2"
        id="eth-input"
        onChange={setEthInputValue}
        placeholder="0.0"
        value={ethInputValue}
      />
      <div className="mt-6 flex items-end justify-between">
        <p>USDC</p>
        <p className="text-sm text-neutral-300">Balance: {usdcTokenBalance}</p>
      </div>
      <Input
        className="text-md rounded-lg border border-[#363636] bg-transparent px-3 py-2"
        id="Close position"
        onChange={setUsdcInputValue}
        placeholder="0.0"
        value={usdcInputValue}
      />
      <button
        className="my-4 rounded-lg border border-[#363636] bg-[#1b1d22] py-2"
        onClick={() => deposit()}
      >
        Deposit
      </button>
    </div>
  );
}

function SellGm() {
  const { withdraw } = useWithdraw();

  return (
    <div className="mt-4 flex flex-col gap-2">
      <input />
      <input />
      <button onClick={() => withdraw()}>Withdraw</button>
    </div>
  );
}

const tabItems: [TabItemType, TabItemType] = [
  { content: <BuyGm />, label: "Buy GM", value: "buy" },
  { content: <SellGm />, label: "Sell GM", value: "sell" },
];

export default function MarketsPage({
  params: { marketAddress },
}: MarketPageProps) {
  if (Markets[marketAddress] === undefined) {
    notFound();
  }

  return (
    <main className="mx-auto mt-6 w-full max-w-xl px-4">
      <div className="mx-auto rounded-xl border border-[#2A2E37]">
        <Tabs ariaLabel="" defaultValue="buy" items={tabItems} />
      </div>
    </main>
  );
}
