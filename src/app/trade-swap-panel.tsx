import Swap from "./swap";
import Trade from "./trade";
import Panel from "./ui/panel";
import Tabs, { type TabItemType } from "./ui/tabs";

export default function TradeSwapPanel() {
  const tabItems: [TabItemType, TabItemType] = [
    { content: <Trade />, label: "Trade", value: "trade" },
    { content: <Swap />, label: "Swap", value: "swap" },
  ];

  return (
    <Panel className="w-96 border-l border-[#2A2E37] p-4 flex">
      <Tabs ariaLabel="Trade or Swap" items={tabItems} />
    </Panel>
  );
}
