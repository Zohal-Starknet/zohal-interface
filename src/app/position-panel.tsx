import Position from "./position";
import Swap from "./swap";
import Trade from "./trade";
import Panel from "./ui/panel";
import Tabs, { TabItemType } from "./ui/tabs";

export default function PositionPanel() {
  const tabItems: [TabItemType, TabItemType, TabItemType, TabItemType] = [
    {
      label: "Positions",
      value: "trade",
      content: <Position />,
    },
    { label: "Orders", value: "orders", content: <></> },
    { label: "Trades", value: "trades", content: <></> },
    { label: "Claims", value: "claims", content: <></> },
  ];

  return (
    <Panel className="flex-initial basis-[25rem] px-8 py-4">
      <Tabs items={tabItems} ariaLabel="Manage position" />
    </Panel>
  );
}
