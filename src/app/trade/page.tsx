import ChartPanel from "./_components/chart-panel";
import Footer from "./_components/footer";
import PositionPanel from "./_components/position-panel";
import TradeSwapPanel from "./_components/trade-swap-panel";

export default function Home() {
  return (
    <div className="lg:flex lg:flex-col lg:items-center lg:justify-start lg:h-full">
      <main className="flex flex-auto flex-col lg:flex-row lg:overflow-hidden max-w-[1440px]">
        <div className="flex flex-auto flex-col lg:max-w-2xl xl:max-w-4xl 2xl:max-w-full lg:px-4">
          <ChartPanel />
          <PositionPanel className="hidden lg:block" />
        </div>
        <TradeSwapPanel />
      </main>
      {/* Mobile position Panel */}
      <PositionPanel className="lg:hidden px-4" />
      <Footer />
    </div>
  );
}
