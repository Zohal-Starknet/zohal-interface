/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Divider from "../../_ui/divider";
import ChartHeader from "./chart-header";
import TokenChart from "./token-chart";

export default function ChartPanel() {
  const [symbol, setSymbol] = useState("ETH/USD");

  const onSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
  };

  return (
    <div className="flex h-full flex-auto flex-col border-border lg:border-r">
      <ChartHeader initialSymbol={symbol} onSymbolChange={onSymbolChange} />
      <Divider />
      <TokenChart symbol={symbol} />
    </div>
  );
}
