import Divider from "./ui/divider";
import Panel from "./ui/panel";
import TokenChart from "./ui/token-chart";

export default function ChartPanel() {
  return (
    <div className="flex flex-auto flex-col">
      <div className="h-16 flex items-center px-4">
        <div className="flex items-center gap-4 border-r border-[#2A2E37] h-full pr-6">
          <img src="/tokens/ethereum.png" className="w-8" />
          <span>ETH-USD</span>
        </div>
      </div>
      <Divider />
      <Panel className="flex-auto flex-col border-b border-[#2A2E37]">
        <TokenChart />
      </Panel>
    </div>
  );
}
