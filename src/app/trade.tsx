"use client";
import PriceInfo from "./components/price-info";
import Button from "./ui/button";
import Divider from "./ui/divider";
import Fieldset from "./ui/fieldset";
import Form from "./ui/form/form";
import TokenSwapButton from "./ui/form/token-swap-button";
import Input from "./ui/input";
import Switch from "./ui/switch";

export default function Trade() {
  return (
    <Form>
      <Fieldset field={<Input placeholder="0.00" />} label="Pay" />

      <TokenSwapButton />

      <Fieldset field={<Input placeholder="0.00" />} label="Long/Short" />

      <div className="py-6">
        <div className="flex pl-1 items-center w-full justify-between">
          <label className="text-sm">Leverage</label>
          <div className="flex items-center gap-1">
            <label className="text-xs text-[#A5A5A7]">Slider</label>
            <Switch />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full mt-3">
          {/* TODO: Input full width */}
          <div className="flex-auto p-2 rounded-md bg-[#25272E] border border-[#363636]">
            <Input placeholder="0.00×" />
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <button className="text-xs rounded-lg bg-[#1b1d22] h-9 border border-[#363636]">
              2×
            </button>
            <button className="text-xs rounded-lg bg-[#1b1d22] h-9 border border-[#363636]">
              5×
            </button>
            <button className="text-xs rounded-lg bg-[#1b1d22] h-9 border border-[#363636]">
              10×
            </button>
            <button className="text-xs rounded-lg bg-[#1b1d22] h-9 border border-[#363636]">
              20×
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border border-[#363636] rounded-md p-3">
        {priceInfos.map((priceInfo, index) => (
          <PriceInfo key={index} {...priceInfo} />
        ))}
      </div>

      <div className="grid items-center gap-2 grid-cols-2 mt-4 w-full">
        <Button type="submit" variant="success">
          Buy/Long
        </Button>
        <Button type="submit" variant="danger">
          Sell/Short
        </Button>
      </div>

      <h3 className="mt-8">ETH Trade</h3>
      <div className="flex flex-col gap-2 border border-[#363636] rounded-md p-3">
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
