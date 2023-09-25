import TradeSwapPanel from "./trade-swap-panel";
import Panel from "./ui/panel";

export default function Home() {
  return (
    <main className="flex flex-auto gap-3 p-3 h-full">
      <div className="flex flex-auto flex-col gap-3 rounded-md">
        <Panel className="flex-auto">Chart</Panel>
        <Panel className="flex-initial basis-[20rem]">Position</Panel>
      </div>
      <TradeSwapPanel />
    </main>
  );
}
