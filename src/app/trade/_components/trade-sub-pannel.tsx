import React, { useState } from 'react';
import Tabs, { type TabItemType } from '../../_ui/tabs';
import MarketSwap from './market-swap';
import LimitSwap from './limit-swap';

type SubPanelProps = {
    className?: string;
};

export default function SubPanel({ className }: SubPanelProps) {
    const swapTabItems: [TabItemType, TabItemType] = [
        { content: <MarketSwap />, label: "Market", value: "market" },
        { content: <LimitSwap />, label: "Limit", value: "limit" },
    ];

    const [selectedTab, setSelectedTab] = useState("market");

    const handleTabChange = (newTabValue: string) => {
        setSelectedTab(newTabValue);
    };

    return (
        <div className={className}>
            <Tabs
                ariaLabel="Market or Limit"
                defaultValue="market"
                items={swapTabItems}
                value={selectedTab}
                onValueChange={handleTabChange}
            />
        </div>
    );
}
