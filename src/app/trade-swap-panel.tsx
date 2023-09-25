import Swap from "./swap";
import Trade from "./trade";
import Panel from "./ui/panel";
import Tabs from "./ui/tabs";

export default function TradeSwapPanel() {
  const tabItems = [
    { label: "Trade", value: "trade", content: <Trade /> },
    { label: "Swap", value: "swap", content: <Swap /> },
  ];

  return (
    <Panel className="w-80">
      <Tabs items={tabItems} ariaLabel="Trade or Swap" />
    </Panel>
  );
}
