import ChartPanel from "./_components/chart-panel";
import PositionPanel from "./_components/position-panel";
import TradeSwapPanel from "./_components/trade-swap-panel";

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
