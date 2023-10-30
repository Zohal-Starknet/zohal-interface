import ChartPanel from "./_components/chart-panel";
import Footer from "./_components/footer";
import PositionPanel from "./_components/position-panel";
import TradeSwapPanel from "./_components/trade-swap-panel";

export default function Home() {
  return (
    <>
      <main className="flex flex-auto overflow-hidden">
        <div className="flex flex-auto flex-col">
          <ChartPanel />
          <PositionPanel />
        </div>
        <TradeSwapPanel />
      </main>
      <Footer />
    </>
  );
}
