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
    <Panel className="flex w-full border-[#2A2E37] p-4 lg:min-w-[20rem] lg:max-w-[24rem] lg:overflow-y-auto lg:border-l">
      <Tabs ariaLabel="Trade or Swap" items={tabItems} />
    </Panel>
  );
}
