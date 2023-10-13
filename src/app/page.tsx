import ChartPanel from "./chart-panel";
import PositionPanel from "./position-panel";
import TradeSwapPanel from "./trade-swap-panel";
import Panel from "./ui/panel";
import TokenChart from "./ui/token-chart";

export default function Home() {
  return (
    <main className="flex flex-auto h-full">
      <div className="flex flex-auto flex-col">
        <ChartPanel />
        <PositionPanel />
      </div>
      <TradeSwapPanel />
    </main>
  );
}
