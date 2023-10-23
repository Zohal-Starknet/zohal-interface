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
      <Fieldset field={<Input />} label="Pay" />

      <TokenSwapButton />

      <Fieldset field={<Input />} label="Long/Short" />

      <Divider className="my-3" />

      <div className="py-3">
        <div className="flex w-full items-center justify-between pl-1">
          <label className="text-sm">Leverage</label>
          <div className="flex items-center gap-1">
            <label className="text-xs text-[#A5A5A7]">Slider</label>
            <Switch />
          </div>
        </div>

        <div className="mt-3 flex w-full flex-col gap-2">
          <div className="flex-auto rounded-md bg-[#25272E] p-2">
            <Input />
          </div>
          <div className="grid grid-cols-4 items-center gap-3">
            <button className="h-9 rounded-lg bg-[#3b3d43] text-xs">2×</button>
            <button className="h-9 rounded-lg bg-[#3b3d43] text-xs">5×</button>
            <button className="h-9 rounded-lg bg-[#3b3d43] text-xs">10×</button>
            <button className="h-9 rounded-lg bg-[#3b3d43] text-xs">20×</button>
          </div>
        </div>
      </div>

      <Divider className="my-3" />

      <div className="flex flex-col gap-2">
        {priceInfos.map((priceInfo, index) => (
          <PriceInfo key={index} {...priceInfo} />
        ))}
      </div>

      <Divider className="my-3" />

      <div className="mt-auto grid w-full grid-cols-2 items-center gap-2">
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
