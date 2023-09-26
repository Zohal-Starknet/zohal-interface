"use client";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "@satoru/app/ui/icons";
import { useState } from "react";

// TODO - Export Chevron animated in its own component
export default function SwapMoreInformations() {
  const [open, setOpen] = useState(false);
  // TODO - find a better way not to display close animation
  const [clickedOnce, setClickedOnce] = useState(false);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={(openValue) => {
        setOpen(openValue);
        setClickedOnce(true);
      }}
      className="mt-5 pl-1"
    >
      <Collapsible.CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between">
          <span>More informations</span>
          <ChevronRight
            className={`text-white text-right ${
              open
                ? "animate-[rotate90_200ms_ease_forwards]"
                : clickedOnce
                ? "animate-[rotate0_200ms_ease_forwards]"
                : ""
            }`}
          />
        </div>
      </Collapsible.CollapsibleTrigger>
      <Collapsible.CollapsibleContent className="mt-4 overflow-hidden data-[state=open]:animate-[slideDown_200ms_ease] data-[state=closed]:animate-[slideUp_200ms_ease]">
        <div className="flex flex-col gap-2 pr-2">
          {priceInfos.map((info, index) => (
            <PriceInfo key={index} {...info} />
          ))}
        </div>
      </Collapsible.CollapsibleContent>
    </Collapsible.Root>
  );
}

// TODO - Do real Price informations based on User selection and input
const priceInfos = [
  { label: "Token 1 Price", value: "$26,146.00" },
  { label: "Token 2 Price", value: "$0.818" },
  { label: "Available Liquidity", value: "$272,569.02" },
  { label: "Price", value: "31913.0674 ARB / BTC" },
];

type PriceInfoProps = {
  label: string;
  value: string;
};

function PriceInfo(props: PriceInfoProps) {
  const { label, value } = props;

  return (
    <div className="flex">
      <span className="text-xs text-[#ffffffb3]">{label}</span>
      <span className="ml-auto text-xs">{value}</span>
    </div>
  );
}
