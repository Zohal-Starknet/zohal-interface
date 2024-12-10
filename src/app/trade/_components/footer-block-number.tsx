"use client";

import { useAccount, useBlock, useNetwork } from "@starknet-react/core";
import { BlockTag } from "starknet";

const testnetBlockUrl = "https://voyager.online/block";

export default function FooterBlockNumber() {
  const { chainId: walletChainId } = useAccount();
  const { chain } = useNetwork();

  const { data: block } = useBlock({ blockIdentifier: BlockTag.LATEST });

  // TODO @YohanTz: Show Skeleton
  if (block === undefined) {
    return null;
  }

  /**
   * TODO @YohanTz: Always take current block from Sepolia, even if no wallet connected
   * By configuring the StarknetConfig provider ?
   */

  if (walletChainId !== chain.id && walletChainId !== undefined) {
    return (
      <div className={badgeContainerClassName}>
        <div className="h-2 w-2 rounded-full bg-[#FF5354]" />
        <span className="text-xs">Unsupported network</span>
      </div>
    );
  }
  return (
    <a
      className={badgeContainerClassName}
      href={`${testnetBlockUrl}/${block}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="h-2 w-2 rounded-full bg-[#40B68B]" />
    </a>
  );
}

const badgeContainerClassName =
  "inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-2 py-1";
