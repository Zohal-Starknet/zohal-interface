import clsx from "clsx";

import Panel from "../../_ui/panel";
import Tabs, { type TabItemType } from "../../_ui/tabs";
import Position from "./position";
import Orders from "./orders";
import OpenOrders from "./open-orders";
import useUserOrder from "../_hooks/use-user-order";
import useUserPosition from "../_hooks/use-user-position";


type PositionPanelProps = {
  className?: string;
};

export default function PositionPanel(props: PositionPanelProps) {
  const { orders_count } = useUserOrder();
  const { positions_count } = useUserPosition();
  
  const tabItems: [TabItemType, TabItemType, TabItemType] = [
    {
      content: <Position className="pl-4 pt-1" />,
      label: "Positions (" + positions_count.toString() + ")",
      value: "trade",
    },
    { content: <OpenOrders className="pl-4 pt-1" />,
      label: "Open Orders (" + orders_count.toString() + ")",
      value: "open orders" },

    { content: <Orders className="pl-4 pt-1" />,
      label: "Orders History",
      value: "orders history" }
  ];

  const { className } = props;

  return (
    <Panel className={clsx("lg:h-80 lg:overflow-y-auto border-border lg:border-r ", className)}>
      <Tabs ariaLabel="Manage position" items={tabItems} defaultValue="trade"/>
    </Panel>
  );
}
