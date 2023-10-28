"use client";

import { useBlock, useNetwork } from "@starknet-react/core";

const testnetBlockUrl = "https://goerli.voyager.online/block";

export default function FooterBlockNumber() {
  const { data: block } = useBlock({ refetchInterval: 3000 });

  const { chain } = useNetwork();

  // TODO @YohanTz: Show Skeleton
  if (block === undefined) {
    return <div></div>;
  }

  /**
   * TODO @YohanTz: Always take current block from Goerli, even if no wallet connected
   * By configuring the StarknetConfig provider ?
   */

  if (chain?.name !== "Starknet Görli") {
    return (
      <div className={badgeContainerClassName}>
        <div className="h-2 w-2 rounded-full bg-[#FF5354]" />
        <span className="text-xs">Unsupported network</span>
      </div>
    );
  }
  return (
    <a
      href={`${testnetBlockUrl}/${block.block_hash}`}
      className={badgeContainerClassName}
      target="_blank"
    >
      <div className="h-2 w-2 rounded-full bg-[#40B68B]" />
      <span className="text-xs">{block.block_number}</span>
    </a>
  );
}

const badgeContainerClassName =
  "inline-flex items-center gap-2 rounded-md border border-[#363636] bg-[#1b1d22] px-2 py-1";
