"use client";

import ChartPanel from "./_components/chart-panel";
import Footer from "./_components/footer";
import PositionPanel from "./_components/position-panel";
import TradeSwapPanel from "./_components/trade-swap-panel";
import { useState } from "react";

export default function Home() {
  const [activePanel, setActivePanel] = useState("chart");

  return (
    <div className="flex flex-col h-full">
      <main className="hidden lg:flex flex-auto flex-col lg:flex-row lg:overflow-hidden h-full">
        <div className="flex flex-auto flex-col h-full">
          <ChartPanel />
          <PositionPanel className="hidden lg:block h-full" />
        </div>
        <TradeSwapPanel />
      </main>

      {/* Mobile View */}
      <div className="flex-auto lg:hidden">
        {activePanel === "chart" && <ChartPanel />}
        {activePanel === "position" && <PositionPanel />}
        {activePanel === "trade" && <TradeSwapPanel />}
      </div>

      <Footer activePanel={activePanel} setActivePanel={setActivePanel} />
    </div>
  );
}
