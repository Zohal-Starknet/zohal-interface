/* eslint-disable @next/next/no-img-element */
import Divider from "../../_ui/divider";
import Panel from "../../_ui/panel";
import ChartHeader from "./chart-header";
import TokenChart from "./token-chart";

export default function ChartPanel() {
  return (
    <div className="flex flex-auto flex-col">
      <ChartHeader />
      <Divider />
      <Panel className="flex-auto flex-col border-b border-[#2A2E37]">
        <TokenChart />
      </Panel>
    </div>
  );
}
