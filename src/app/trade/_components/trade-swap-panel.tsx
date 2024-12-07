import Panel from "../../_ui/panel";
import Tabs, { type TabItemType } from "../../_ui/tabs";
import Trade from "./trade";
import TradeTpSl from "./trade-tp-sl";
import TradeTrigger from "./trade-trigger";

const tabItems: [TabItemType, TabItemType, TabItemType] = [
  { content: <Trade className="p-4" />, label: "Market", value: "trade" },
  { content: <TradeTrigger className="p-4" />, label: "Limit", value: "limit" },
  { content: <TradeTpSl className="p-4" />, label: "TP/SL", value: "tpsl" },
];

export default function TradePanel() {
  return (
    <Panel className="flex w-full border-border lg:min-w-[20rem] lg:max-w-[24rem] lg:overflow-y-auto lg:border-l ">
      <Tabs ariaLabel="Trade" defaultValue="trade" items={tabItems} />
    </Panel>
  );
}
