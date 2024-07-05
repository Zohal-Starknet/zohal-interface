/* eslint-disable @next/next/no-img-element */
import Divider from "../../_ui/divider";
import ChartHeader from "./chart-header";
import TokenChart from "./token-chart";

export default function ChartPanel() {
  return (
    <div className="flex flex-auto flex-col h-full">
      <ChartHeader />
      <Divider />
      <TokenChart/>
    </div>
  );
}
