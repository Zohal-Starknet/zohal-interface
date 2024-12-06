"use client";
import ChartPanel from "./_components/chart-panel";
import Footer from "./_components/footer";
import PositionPanel from "./_components/position-panel";
import TradePanel from "./_components/trade-swap-panel";
import { useState } from "react";

export default function Home() {
  const [activePanel, setActivePanel] = useState("chart");

  return (
    <div className="flex h-screen flex-col">
      <main className="hidden h-full flex-auto flex-row overflow-hidden lg:flex">
        <div className="flex h-full flex-auto flex-col">
          <div className="h-2/3 flex-shrink-0 overflow-hidden">
            <ChartPanel />
          </div>
          <div className="hidden h-1/3 flex-shrink-0 overflow-hidden lg:block">
            <PositionPanel />
          </div>
        </div>
        <div className="lg:h-full lg:w-[400px] lg:overflow-y-auto">
          <TradePanel />
        </div>
      </main>

      {/* Mobile View */}
      <div className="flex-auto lg:hidden">
        {activePanel === "chart" && <ChartPanel />}
        {activePanel === "position" && <PositionPanel />}
        {activePanel === "trade" && <TradePanel />}
      </div>

      <Footer activePanel={activePanel} setActivePanel={setActivePanel} />
    </div>
  );
}
