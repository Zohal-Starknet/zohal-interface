import ChartPanel from "./chart-panel";
import PositionPanel from "./position-panel";
import TradeSwapPanel from "./trade-swap-panel";

export default function Home() {
  return (
    <main className="flex h-full flex-auto">
      <div className="flex flex-auto flex-col">
        <ChartPanel />
        <PositionPanel />
      </div>
      <TradeSwapPanel />
    </main>
  );
}
