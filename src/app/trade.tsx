"use client";
import PriceInfo from "./components/price-info";
import Button from "./ui/button";
import Fieldset from "./ui/fieldset";
import Form from "./ui/form/form";
import TokenSwapButton from "./ui/form/token-swap-button";
import Input from "./ui/input";
import Switch from "./ui/switch";

export default function Trade() {
  const test = 12;

  return (
    <Form>
      <Fieldset
        field={
          <Input
            onChange={(value) => {
              console.log(value);
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
            onChange={(value) => {
              console.log(value);
            }}
            placeholder="0.00"
            value=""
          />
        }
        label="Long/Short"
      />

      <div className="py-6">
        <div className="flex w-full items-center justify-between pl-1">
          <label className="text-sm">Leverage</label>
          <div className="flex items-center gap-1">
            <label className="text-xs text-[#A5A5A7]">Slider</label>
            <Switch />
          </div>
        </div>

        <div className="mt-3 flex w-full flex-col gap-2">
          {/* TODO: Input full width */}
          <div className="flex-auto rounded-md border border-[#363636] bg-[#25272E] p-2">
            <Input placeholder="0.00×" />
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <button className="h-9 rounded-lg border border-[#363636] bg-[#1b1d22] text-xs">
              2×
            </button>
            <button className="h-9 rounded-lg border border-[#363636] bg-[#1b1d22] text-xs">
              5×
            </button>
            <button className="h-9 rounded-lg border border-[#363636] bg-[#1b1d22] text-xs">
              10×
            </button>
            <button className="h-9 rounded-lg border border-[#363636] bg-[#1b1d22] text-xs">
              20×
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-md border border-[#363636] p-3">
        {priceInfos.map((priceInfo, index) => (
          <PriceInfo key={index} {...priceInfo} />
        ))}
      </div>

      {/* <Divider className="my-3" /> */}

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
