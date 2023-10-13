import Swap from "./swap";
import Trade from "./trade";
import Panel from "./ui/panel";
import Tabs, { TabItemType } from "./ui/tabs";

export default function TradeSwapPanel() {
  const tabItems: [TabItemType, TabItemType] = [
    { label: "Trade", value: "trade", content: <Trade /> },
    { label: "Swap", value: "swap", content: <Swap /> },
  ];

  return (
    <Panel className="w-96 border-l border-[#2A2E37] p-3 flex">
      <Tabs items={tabItems} ariaLabel="Trade or Swap" />
    </Panel>
  );
}
