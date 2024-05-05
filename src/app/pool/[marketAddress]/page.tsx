"use client";

import { Markets } from "@zohal/app/_helpers/markets";
import Tabs, { type TabItemType } from "@zohal/app/_ui/tabs";
import { notFound } from "next/navigation";

import useDeposit from "./_hooks/use-deposit";
import useWithdraw from "./_hooks/use-withdraw";

interface MarketPageProps {
  params: {
    marketAddress: `0x${string}`;
  };
}

function BuyGm() {
  const { deposit } = useDeposit();

  return (
    <div className="mt-4 flex flex-col gap-2">
      <input />
      <input />
      <button onClick={() => deposit()}>Deposit</button>
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
    <main className="mx-auto mt-6 w-full max-w-2xl px-4">
      <div className="mx-auto border border-[#2A2E37]">
        <Tabs ariaLabel="" defaultValue="buy" items={tabItems} />
      </div>
    </main>
  );
}
