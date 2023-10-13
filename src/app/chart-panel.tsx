import Divider from "./ui/divider";
import Panel from "./ui/panel";
import TokenChart from "./ui/token-chart";

export default function ChartPanel() {
  return (
    <div className="flex flex-auto flex-col">
      <div className="h-[4.75rem] flex items-center px-4">
        <div className="flex items-center gap-4 border-r border-[#2A2E37] h-full pr-[10rem]">
          <img src="/tokens/ethereum.png" className="w-8" />
          <span>ETH-USD</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex gap-2 items-center pl-5">
            <span className="text-[#40B68B]">$1,544.27</span>
            <span className="py-1 px-2 text-xs font-semibold rounded-md bg-[#40B68B] text-black">
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
