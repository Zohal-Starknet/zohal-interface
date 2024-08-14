import React, { useState } from 'react';
import MarketTrade from './market-trade';
import LimitTrade from './limit-trade';
import { TabItemType } from '@zohal/app/_ui/tabs';

type NewSubPanelProps = {
    className?: string;
};

export default function NewSubPanel({ className }: NewSubPanelProps) {
    const swapTabItems: [TabItemType, TabItemType] = [
        { content: <MarketTrade />, label: "Market", value: "market" },
        { content: <LimitTrade />, label: "Limit", value: "limit" },
    ];

    const [selectedTab, setSelectedTab] = useState("market");

    const handleTabChange = (newTabValue: string) => {
        setSelectedTab(newTabValue);
    };

    return (
        <div>
            <div aria-label="Market or Limit" className="flex gap-2 mb-4">
                {swapTabItems.map((item) => (
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-medium ${selectedTab === item.value
                            ? 'border border-transparent bg-blue-600 text-white'
                            : 'border border-transparent bg-gray-700 text-gray-300'
                            }`}
                        key={item.value}
                        onClick={() => handleTabChange(item.value)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            <Divider />
            {swapTabItems.map((item) => (
                <div className={`flex-1 ${selectedTab === item.value ? '' : 'hidden'}`} key={item.value}>
                    {item.content}
                </div>
            ))}
        </div>
    );

    function Divider() {
        return <div className="border-t border-gray-600 my-4" />;
    }
}
