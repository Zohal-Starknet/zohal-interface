import Panel from "./ui/panel";
import TokenChart from "./ui/token-chart";

export default function Home() {
  return (
    <main className="flex flex-auto gap-3 p-3 h-full">
      <div className="flex flex-auto flex-col gap-3 rounded-md">
        <Panel className="flex-auto flex-col">
          Trading View
          <TokenChart />
        </Panel>

        <Panel className="flex-initial basis-[20rem]">Position</Panel>
      </div>
      <Panel className="w-80">Trade / Swap</Panel>
    </main>
  );
}
