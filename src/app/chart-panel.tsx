/* eslint-disable @next/next/no-img-element */
import Divider from "./ui/divider";
import Panel from "./ui/panel";
import TokenChart from "./ui/token-chart";

export default function ChartPanel() {
  return (
    <div className="flex flex-auto flex-col">
      <div className="flex h-[4.75rem] items-center px-4">
        <div className="flex h-full items-center gap-4 border-r border-[#2A2E37] pr-[10rem]">
          <img alt="ethereum logo" className="w-8" src="/tokens/ethereum.png" />
          <span>ETH-USD</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 pl-5">
            <span className="text-[#40B68B]">$1,544.27</span>
            <span className="rounded-md bg-[#40B68B] px-2 py-1 text-xs font-semibold text-black">
              +0.71%
            </span>
          </div>
          <VerticalDivider />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#A5A5A7]">Index Price</span>
            <span className="text-white">$1,544.30</span>
          </div>
          <VerticalDivider />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#A5A5A7]">Oracle Price</span>
            <span className="text-white">$1,544.30</span>
          </div>
          <VerticalDivider />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#A5A5A7]">24h Change</span>
            <span className="text-[#40B68B]">$24.80(+0.71%)</span>
          </div>
          <VerticalDivider />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#A5A5A7]">24h High</span>
            <span className="text-white">$1,594.30</span>
          </div>
          <VerticalDivider />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[#A5A5A7]">24h Low</span>
            <span className="text-white">$1,504.30</span>
          </div>
        </div>
      </div>
      <Divider />
      <Panel className="flex-auto flex-col border-b border-[#2A2E37]">
        <TokenChart />
      </Panel>
    </div>
  );
}

function VerticalDivider() {
  return <div className="h-6 w-[1px] bg-[#2A2E37]" />;
}
