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
  { name: "10×", value: 10 },
  { name: "15×", value: 15 },
  { name: "20×", value: 20 },
];

export default function TradeLeverageInput(props: TradeLeverageInputProps) {
  const { className, leverage, setLeverage } = props;

  function onLeverageChange(value: string) {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 20) {
      setLeverage(numericValue);
    } else if (numericValue < 1) {
      setLeverage(1);
    } else if (numericValue > 20) {
      setLeverage(20);
    }
  }

  return (
    <div className={className}>
      <label className="text-sm">Leverage</label>

      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-4">
          <Slider
            max={20}
            min={1}
            //@ts-ignore
            onValueChange={(value) => setLeverage(value)}
            step={0.1}
            value={[leverage]}
          />
          <div className="h-10 w-20 flex-auto items-center rounded-md border border-border bg-card">
            <Input
              className="h-full w-full bg-transparent px-2 text-sm"
              onChange={onLeverageChange}
              placeholder="0.00×"
              value={leverage.toString()}
              disabled={false}
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-4 items-center gap-3">
          {leverageInputs.map((leverageInput) => {
            return (
              <button
                className="h-10 flex-shrink-0 rounded-lg border border-border px-2 text-xs text-primary-foreground"
                key={leverageInput.name}
                style={{
                  background: "blue",
                }}
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
