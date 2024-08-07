import Panel from "../../_ui/panel";
import Tabs, { type TabItemType } from "../../_ui/tabs";
import Swap from "./swap";
import Trade from "./trade";

const tabItems: [TabItemType, TabItemType] = [
  { content: <Trade className="p-4" />, label: "Trade", value: "trade" },
  { content: <Swap className="p-4" />, label: "Swap", value: "swap" },
];

export default function TradeSwapPanel() {
  return (
    <Panel className="flex w-full border-border lg:min-w-[20rem] lg:max-w-[24rem] lg:overflow-y-auto lg:border-l ">
      <Tabs ariaLabel="Trade or Swap" defaultValue="trade" items={tabItems} />
    </Panel>
  );
}
