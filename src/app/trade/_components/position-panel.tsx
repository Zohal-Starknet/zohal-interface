import clsx from "clsx";

import Panel from "../../_ui/panel";
import Tabs, { type TabItemType } from "../../_ui/tabs";
import Position from "./position";
import Orders from "./orders";


type PositionPanelProps = {
  className?: string;
};

export default function PositionPanel(props: PositionPanelProps) {
  const tabItems: [TabItemType, TabItemType] = [
    {
      content: <Position className="p-4" />,
      label: "Positions",
      value: "trade",
    },
    { content: <Orders className="p-4" />,
      label: "Orders",
      value: "orders" }
  ];

  const { className } = props;

  return (
    <Panel className={clsx("lg:h-80 lg:overflow-y-auto", className)}>
      <Tabs ariaLabel="Manage position" items={tabItems} />
    </Panel>
  );
}
