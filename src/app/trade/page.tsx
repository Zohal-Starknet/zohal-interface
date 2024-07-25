"use client";

import ChartPanel from "./_components/chart-panel";
import Footer from "./_components/footer";
import PositionPanel from "./_components/position-panel";
import TradeSwapPanel from "./_components/trade-swap-panel";
import { useState } from "react";

export default function Home() {
  const [activePanel, setActivePanel] = useState("chart");

  return (
    <>
      <main className="hidden lg:flex flex-auto flex-col lg:flex-row lg:overflow-hidden h-full">
        <div className="flex flex-auto flex-col h-full">
          <ChartPanel />
          <PositionPanel className="hidden lg:block h-full" />
        </div>
        <TradeSwapPanel />
      </main>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="flex justify-around bg-gray-800 p-2">
          <button
            onClick={() => setActivePanel("chart")}
            className={`px-4 py-2 ${
              activePanel === "chart" ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setActivePanel("position")}
            className={`px-4 py-2 ${
              activePanel === "position" ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            Position
          </button>
          <button
            onClick={() => setActivePanel("trade")}
            className={`px-4 py-2 ${
              activePanel === "trade" ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            Trade
          </button>
        </div>

        {activePanel === "chart" && <ChartPanel />}
        {activePanel === "position" && <PositionPanel />}
        {activePanel === "trade" && <TradeSwapPanel />}
      </div>

      <Footer />
    </>
  );
}
