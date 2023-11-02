import Panel from "../../_ui/panel";
import Tabs, { type TabItemType } from "../../_ui/tabs";
import Position from "./position";

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
    <Panel className="h-72 overflow-auto px-8 py-4">
      <Tabs ariaLabel="Manage position" items={tabItems} />
    </Panel>
  );
}
