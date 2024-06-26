"use client";

import Input from "@zohal/app/_ui/input";
import { Slider } from "@zohal/app/_ui/slider";
import { useState } from "react";

type TradeLeverageInputProps = {
  /** ClassName applied to the container of the component */
  className?: string;
};

const leverageInputs = [
  { name: "5×", value: 5 },
  { name: "10×", value: 10 },
  { name: "25×", value: 25 },
  { name: "50×", value: 50 },
];

export default function TradeLeverageInput(props: TradeLeverageInputProps) {
  const { className } = props;

  const [leverage, setLeverage] = useState("1");

  function onLeverageChange(leverageInput: string) {
    // TODO @YohanTz: Pretty sure that there is a mask library to handle × at the end of the input
    setLeverage(leverageInput.toString());
  }

  return (
    <div className={className}>
      <label className="text-sm">Leverage</label>

      <div className="mt-2 flex w-full flex-col gap-3">
        <div className="flex items-center gap-4">
          <Slider
            max={50}
            min={1.1}
            onValueChange={(value) => setLeverage(value.toString())}
            step={0.1}
            value={[parseFloat(leverage)]}
          />
          <div className="h-10 w-20 flex-auto items-center rounded-md border border-[#363636] bg-[#25272E]">
            <Input
              className="h-full w-full bg-transparent px-2 text-sm"
              onChange={onLeverageChange}
              placeholder="0.00×"
              value={leverage}
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-4 items-center gap-3">
          {leverageInputs.map((leverageInput) => {
            return (
              <button
                className="h-10 flex-shrink-0 rounded-lg border border-[#363636] bg-[#1b1d22] px-2 text-xs"
                key={leverageInput.name}
                onClick={() => setLeverage(leverageInput.value.toString())}
              >
                {leverageInput.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
