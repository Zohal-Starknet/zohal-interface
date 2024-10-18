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
    decimal: Tokens.ETH.decimals
  });

  const { marketTokenBalance: usdcTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens.USDC.address,
    decimal: Tokens.USDC.decimals
  });

  return (
    <div className="mt-4 flex flex-col gap-2 px-4">
      <div className="flex items-end justify-between">
        <p>ETH</p>
        <p className="text-sm text-neutral-300">Balance: {ethTokenBalance}</p>
      </div>
      <Input
        className="text-md border-border rounded-lg border bg-transparent px-3 py-2"
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
        className="text-md border-border rounded-lg border bg-transparent px-3 py-2"
        id="Close position"
        onChange={setUsdcInputValue}
        placeholder="0.0"
        value={usdcInputValue}
      />
      <button
        className="border-border bg-secondary my-4 rounded-lg border py-2"
        onClick={() => deposit(ethInputValue, usdcInputValue)}
      >
        Deposit
      </button>
    </div>
  );
}

function SellGm() {
  const { withdraw } = useWithdraw();

  const { marketTokenBalance: zohTokenBalance } = useMarketTokenBalance({
    marketTokenAddress: Tokens.ZOH.address,
    decimal: Tokens.ZOH.decimals
  });

  const [zohInputValue, setZohInputValue] = useState("");

  return (
    <div className="mt-4 flex flex-col gap-2 px-4">
      <div className="flex items-end justify-between">
        <p>ZOH</p>
        <p className="text-sm text-neutral-300">Balance: {zohTokenBalance}</p>
      </div>
      <Input
        className="text-md border-border rounded-lg border bg-transparent px-3 py-2"
        id="eth-input"
        onChange={setZohInputValue}
        placeholder="0.0"
        value={zohInputValue}
      />
      <button
        className="border-border bg-secondary my-4 rounded-lg border py-2"
        onClick={() => withdraw(zohInputValue)}
      >
        Withdraw
      </button>
    </div>
  );
}

const tabItems: [TabItemType, TabItemType] = [
  { content: <BuyGm />, label: "Buy ZOH", value: "buy" },
  { content: <SellGm />, label: "Sell ZOH", value: "sell" },
];

export default function MarketsPage({
  params: { marketAddress },
}: MarketPageProps) {
  if (Markets[marketAddress] === undefined) {
    notFound();
  }

  return (
    <main className="mx-auto mt-6 w-full max-w-xl px-4">
      <div className="border-border mx-auto rounded-xl border">
        <Tabs ariaLabel="" defaultValue="buy" items={tabItems} />
      </div>
    </main>
  );
}
