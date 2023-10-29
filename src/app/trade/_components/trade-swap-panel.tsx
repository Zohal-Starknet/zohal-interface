import Panel from "../../_ui/panel";
import Tabs, { type TabItemType } from "../../_ui/tabs";
import Swap from "./swap";
import Trade from "./trade";

export default function TradeSwapPanel() {
  const tabItems: [TabItemType, TabItemType] = [
    { content: <Trade />, label: "Trade", value: "trade" },
    { content: <Swap />, label: "Swap", value: "swap" },
  ];

  return (
    <Panel className="flex w-full min-w-[20rem] max-w-[24rem] overflow-y-scroll border-l border-[#2A2E37] p-4">
      <Tabs ariaLabel="Trade or Swap" items={tabItems} />
    </Panel>
  );
}
