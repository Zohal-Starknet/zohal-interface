import clsx from "clsx";

import Panel from "../../_ui/panel";
import Tabs, { type TabItemType } from "../../_ui/tabs";
import Position from "./position";

type PositionPanelProps = {
  className?: string;
};

export default function PositionPanel(props: PositionPanelProps) {
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

  const { className } = props;

  return (
    <Panel className={clsx("px-8 py-4 lg:h-72 lg:overflow-y-auto", className)}>
      <Tabs ariaLabel="Manage position" items={tabItems} />
    </Panel>
  );
}
