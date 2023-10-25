import Position from "./position";
import Panel from "./ui/panel";
import Tabs, { type TabItemType } from "./ui/tabs";

export default function PositionPanel() {
  const tabItems: [TabItemType, TabItemType, TabItemType, TabItemType] = [
    {
      content: <Position />,
      label: "Positions",
      value: "trade",
    },
    { content: <></>, label: "Orders", value: "orders" },
    { content: <></>, label: "Trades", value: "trades" },
    { content: <></>, label: "Claims", value: "claims" },
  ];

  return (
    <Panel className="flex-initial basis-[25rem] px-8 py-4">
      <Tabs ariaLabel="Manage position" items={tabItems} />
    </Panel>
  );
}
