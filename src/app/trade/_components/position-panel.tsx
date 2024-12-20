import clsx from "clsx";

import Panel from "../../_ui/panel";
import Tabs, { type TabItemType } from "../../_ui/tabs";
import Position from "./position";
import Orders from "./orders";
import OpenOrders from "./open-orders";
import useGetPosition from "../_hooks/use-get-position";
import useGetOrder from "../_hooks/use-get-order";

type PositionPanelProps = {
  className?: string;
};

export default function PositionPanel(props: PositionPanelProps) {
  const { orders_count } = useGetOrder();
  const { positions, positions_count } = useGetPosition();

  const tabItems: [TabItemType, TabItemType, TabItemType] = [
    {
      content: <Position className="pl-4 pt-1" />,
      label: "Positions (" + positions_count.toString() + ")",
      value: "trade",
    },
    {
      content: <OpenOrders className="pl-4 pt-1" />,
      label: "Open Orders (" + orders_count.toString() + ")",
      value: "open orders",
    },

    {
      content: <Orders className="pl-4 pt-1" />,
      label: "Orders History",
      value: "orders history",
    },
  ];

  const { className } = props;

  return (
    <Panel
      className={clsx(
        "h-80 overflow-y-auto border-r border-border ",
        className,
      )}
    >
      <Tabs ariaLabel="Manage position" items={tabItems} defaultValue="trade" />
    </Panel>
  );
}
