"use client";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "@satoru/app/ui/icons";
import { useState } from "react";
import PriceInfo from "../price-info";

type SwapMoreInformationsProps = {
  /** Ratio between the price of the token to be sold and the token that will be received */
  ratio: number;
  /**
   * Token symbol of the token that is going to be sold
   * TODO: Type this prop stronger than just string
   */
  payTokenSymbol: string;
  /**
   * Token symbol of the token that is going to be received after the swap
   * TODO: Type this prop stronger than just string
   */
  receiveTokenSymbol: string;
};

// TODO - Export Chevron animated in its own component
export default function SwapMoreInformations(props: SwapMoreInformationsProps) {
  const { ratio, payTokenSymbol, receiveTokenSymbol } = props;
  const [open, setOpen] = useState<boolean | undefined>(true);

  const priceInfos = [
    // TODO - Do real Price informations based on User selection and input
    { label: `${payTokenSymbol} Price`, value: "$26,146.00" },
    { label: `${receiveTokenSymbol} Price`, value: "$0.818" },
    { label: "Available Liquidity", value: "$272,569.02" },
    {
      label: "Price",
      value: `${(1 / ratio).toFixed(
        4
      )} ${payTokenSymbol} / ${receiveTokenSymbol}`,
    },
  ];

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={(openValue) => {
        setOpen(openValue);
      }}
      className="mt-5 border border-[#363636] p-2 rounded-md"
    >
      <Collapsible.CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between">
          <span>More informations</span>
          <ChevronRight
            label={open ? "Hide" : "Show"}
            className={`text-white text-right ${
              open === undefined
                ? ""
                : open
                ? "animate-[rotate90_200ms_ease_forwards]"
                : "animate-[rotate0_200ms_ease_forwards]"
            }`}
          />
        </div>
      </Collapsible.CollapsibleTrigger>
      <Collapsible.CollapsibleContent className="overflow-hidden data-[state=open]:animate-[slideDown_200ms_ease] data-[state=closed]:animate-[slideUp_200ms_ease]">
        <div className="flex flex-col gap-2 pr-2 mt-4">
          {priceInfos.map((info, index) => (
            <PriceInfo key={index} {...info} />
          ))}
        </div>
      </Collapsible.CollapsibleContent>
    </Collapsible.Root>
  );
}
