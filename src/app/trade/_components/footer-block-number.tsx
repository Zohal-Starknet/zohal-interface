"use client";

import { useBlockNumber } from "@starknet-react/core";

export default function FooterBlockNumber() {
  const { data: blockNumber } = useBlockNumber({
    refetchInterval: 3000,
  });

  // TODO @YohanTz: Show Skeleton
  if (blockNumber === undefined) {
    return;
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-[#363636] bg-[#1b1d22] px-2 py-1">
      <div className="h-2 w-2 rounded-full bg-[#40B68B]" />
      <span className="text-xs">{blockNumber}</span>
    </div>
  );
}
