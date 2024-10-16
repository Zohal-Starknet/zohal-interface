"use client";

import Input from "@zohal/app/_ui/input";
import { Slider } from "@zohal/app/_ui/slider";
import { useState } from "react";

type TradeLeverageInputProps = {
  /** ClassName applied to the container of the component */
  className?: string;
  leverage: number;
  setLeverage: (value: number) => void;
};

const leverageInputs = [
  { name: "5×", value: 5 },
  { name: "10×", value: 10 }
];

export default function TradeLeverageInput(props: TradeLeverageInputProps) {
  const { className, leverage, setLeverage } = props;

  function onLeverageChange(value: string) {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 10) {
      setLeverage(numericValue);
    } else if (numericValue < 1) {
      setLeverage(1);
    } else if (numericValue > 10) {
      setLeverage(10);
    }
  }

  return (
    <div className={className}>
      <label className="text-sm">Leverage</label>

      <div className="mt-2 flex w-full flex-col gap-3">
        <div className="flex items-center gap-4">
          <Slider
            max={50}
            min={1}
            //@ts-ignore
            onValueChange={(value) => setLeverage(value)}
            step={0.1}
            value={[leverage]}
          />
          <div className="border-border bg-card h-10 w-20 flex-auto items-center rounded-md border">
            <Input
              className="h-full w-full bg-transparent px-2 text-sm"
              onChange={onLeverageChange}
              placeholder="0.00×"
              value={leverage.toString()}
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-2 items-center gap-3">
          {leverageInputs.map((leverageInput) => {
            return (
              <button
                className="border-border bg-secondary h-10 flex-shrink-0 rounded-lg border px-2 text-xs"
                key={leverageInput.name}
                onClick={() => setLeverage(leverageInput.value)}
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
