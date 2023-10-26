"use client";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "@satoru/app/ui/icons";
import { useState } from "react";

import PriceInfo from "../price-info";

type SwapMoreInformationsProps = {
  /**
   * Token symbol of the token that is going to be sold
   * TODO: Type this prop stronger than just string
   */
  payTokenSymbol: string;
  /** Ratio between the price of the token to be sold and the token that will be received */
  ratio: number;
  /**
   * Token symbol of the token that is going to be received after the swap
   * TODO: Type this prop stronger than just string
   */
  receiveTokenSymbol: string;
};

// TODO - Export Chevron animated in its own component
export default function SwapMoreInformations(props: SwapMoreInformationsProps) {
  const { payTokenSymbol, ratio, receiveTokenSymbol } = props;
  const [open, setOpen] = useState<boolean | undefined>(undefined);

  const priceInfos = [
    // TODO - Do real Price informations based on User selection and input
    { label: `${payTokenSymbol} Price`, value: "$26,146.00" },
    { label: `${receiveTokenSymbol} Price`, value: "$0.818" },
    { label: "Available Liquidity", value: "$272,569.02" },
    {
      label: "Price",
      value: `${(1 / ratio).toFixed(
        4,
      )} ${payTokenSymbol} / ${receiveTokenSymbol}`,
    },
  ];

  return (
    <Collapsible.Root
      onOpenChange={(openValue) => {
        setOpen(openValue);
      }}
      className="mt-5 rounded-md border border-[#363636] p-2"
    >
      <Collapsible.CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between">
          <span>More informations</span>
          <ChevronRight
            className={`text-right text-white ${
              open === undefined
                ? ""
                : open
                ? "animate-[rotate90_200ms_ease_forwards]"
                : "animate-[rotate0_200ms_ease_forwards]"
            }`}
            label={open ? "Hide" : "Show"}
          />
        </div>
      </Collapsible.CollapsibleTrigger>
      <Collapsible.CollapsibleContent className="mt-4 overflow-hidden data-[state=closed]:animate-[slideUp_200ms_ease] data-[state=open]:animate-[slideDown_200ms_ease]">
        <div className="flex flex-col gap-2 pr-2">
          {priceInfos.map((info, index) => (
            <PriceInfo key={index} {...info} />
          ))}
        </div>
      </Collapsible.CollapsibleContent>
    </Collapsible.Root>
  );
}
