"use client";
import Fieldset from "./ui/fieldset";
import Input from "./ui/input";
import Form from "./ui/form/form";
import Button from "./ui/button";
import TokenSwapButton from "./ui/form/token-swap-button";
import Divider from "./ui/divider";
import PriceInfo from "./components/price-info";
import Switch from "./ui/switch";

export default function Trade() {
  return (
    <Form>
      <Fieldset label="Pay" field={<Input placeholder="0.00" />} />

      <TokenSwapButton />

      <Fieldset label="Long/Short" field={<Input placeholder="0.00" />} />

      {/* <Divider className="my-3" /> */}

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

      {/* <Divider className="my-3" /> */}

      <div className="flex flex-col gap-2">
        {priceInfos.map((priceInfo, index) => (
          <PriceInfo key={index} {...priceInfo} />
        ))}
      </div>

      {/* <Divider className="my-3" /> */}

      <div className="grid items-center gap-2 grid-cols-2 mt-8 w-full">
        <Button type="submit" variant="success">
          Buy/Long
        </Button>
        <Button type="submit" variant="danger">
          Sell/Short
        </Button>
      </div>
    </Form>
  );
}

const priceInfos = [
  { label: "Entry Price", value: "$0.882" },
  { label: "Price Impact", value: "12%" },
  { label: "Acceptable Price", value: "$0.882" },
  { label: "Liq. Price", value: "$0.156" },
  { label: "Fees and Price Impact", value: "$-85.91" },
];
