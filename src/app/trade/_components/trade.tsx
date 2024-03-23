"use client";

import { type PropsWithClassName } from "@zohal/app/_lib/utils";

import Button from "../../_ui/button";
import Fieldset from "../../_ui/fieldset";
import Form from "../../_ui/form";
import Input from "../../_ui/input";
import PriceInfo from "./price-info";
import TokenSwapButton from "./token-swap-button";
import TradeLeverageInput from "./trade-leverage-input";

export default function Trade({ className }: PropsWithClassName) {
  return (
    <Form className={className}>
      <Fieldset
        field={
          <Input
            className="bg-transparent text-lg"
            onChange={() => {
              return;
            }}
            placeholder="0.00"
            value=""
          />
        }
        label="Pay"
      />

      <TokenSwapButton />

      <Fieldset
        field={
          <Input
            className="bg-transparent text-lg"
            onChange={() => {
              return;
            }}
            placeholder="0.00"
            value=""
          />
        }
        label="Long/Short"
      />

      <TradeLeverageInput className="py-6" />

      <div className="flex flex-col gap-2 rounded-md border border-[#363636] p-3">
        {priceInfos.map((priceInfo, index) => (
          <PriceInfo key={index} {...priceInfo} />
        ))}
      </div>

      <div className="mt-4 grid w-full grid-cols-2 items-center gap-2">
        <Button type="submit" variant="success">
          Buy/Long
        </Button>
        <Button type="submit" variant="danger">
          Sell/Short
        </Button>
      </div>

      <h3 className="mt-8">ETH Trade</h3>
      <div className="flex flex-col gap-2 rounded-md border border-[#363636] p-3">
        {tokenPriceInfos.map((priceInfo, index) => (
          <PriceInfo key={index} {...priceInfo} />
        ))}
      </div>
    </Form>
  );
}

const priceInfos = [
  { label: "Entry Price", value: "$0.882" },
  { label: "Price Impact", value: "12%" },
  { label: "Acceptable Price", value: "$0.882" },
  { label: "Liq. Price", value: "$0.156" },
  { label: "Fees and Price Impact", value: "-$85.91" },
];

const tokenPriceInfos = [
  { label: "Market", value: "ETH-USD" },
  { label: "Entry Price", value: "$1 612.12" },
  { label: "Exit Price", value: "$1 612.12" },
  { label: "Borrow Fee", value: "$0.0007/h" },
  { label: "Funding Fee", value: "$0.0007/h" },
  { label: "Available Liquidity", value: "$100 000.00" },
  { label: "Open Interest Balance", value: "-$85.91" },
];
