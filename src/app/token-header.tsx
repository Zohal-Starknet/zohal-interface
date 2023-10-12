"use client";

import { EthereumIcon } from "./ui/icons";

export default function TokenHeader() {
  return (
    <div className="flex w-full items-center pt-5 pb-8">
      <div className="flex gap-2 p-4 w-[15rem] items-center bg-[#1D1F23] rounded-md">
        <EthereumIcon label="Ethereum Logo" className="w-6" />
        <span>ETH/USD</span>
      </div>

      <div className="flex items-center flex-auto overflow-hidden mx-8 border-l border-r border-[#2A2E37] border-solid">
        <div className="flex justify-around min-w-full animate-[moveRTL_20s_linear_infinite]">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium">$1,159.1</span>
            <span className="text-sm font-thin">Index Price</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium">$1,164.31</span>
            <span className="text-sm font-thin">Oracle Price</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium">-3.06%</span>
            <span className="text-sm font-thin">Variation 24h</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium">$390,630</span>
            <span className="text-sm font-thin">Variation 24h</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium">15,186</span>
            <span className="text-sm font-thin">Transaction 24h</span>
          </div>
        </div>

        <div
          className="flex justify-around min-w-full animate-[moveRTL_20s_linear_infinite]"
          aria-hidden="true"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium">$1,159.1</span>
            <span className="text-sm font-thin">Index Price</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium">$1,164.31</span>
            <span className="text-sm font-thin">Oracle Price</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium">-3.06%</span>
            <span className="text-sm font-thin">Variation 24h</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium">$390,630</span>
            <span className="text-sm font-thin">Variation 24h</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium">15,186</span>
            <span className="text-sm font-thin">Transaction 24h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
