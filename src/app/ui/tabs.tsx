"use client";
import * as RadixTabs from "@radix-ui/react-tabs";
import { useState, ReactNode } from "react";

type TabItem = {
  /** Label shown in the Tab Trigger */
  label: string;
  /** Value of the Tab */
  value: string;
  /** Component that is the content of the Tab */
  content: ReactNode;
};

type TabsProps = {
  /** Tab items */
  items: Array<TabItem>;
  /** a11y label for the Trigger buttons list */
  ariaLabel?: string;
};

export default function Tabs(props: TabsProps) {
  const { items, ariaLabel } = props;

  return (
    <RadixTabs.Root
      className="w-full flex flex-col"
      defaultValue={items[0]?.value}
    >
      <RadixTabs.List
        className="w-full rounded-md p-2 bg-[#25272E] flex"
        aria-label={ariaLabel}
      >
        {items.map((item) => (
          <TabItem key={item.value} label={item.label} value={item.value} />
        ))}
      </RadixTabs.List>
      {items.map((item) => {
        const { value, content } = item;
        return (
          <RadixTabs.Content className="flex-1" key={value} value={value}>
            {content}
          </RadixTabs.Content>
        );
      })}
    </RadixTabs.Root>
  );
}

function TabItem(props: Pick<TabItem, "label" | "value">) {
  const { label, value } = props;

  return (
    <RadixTabs.Trigger
      className="p-2 rounded-md flex-auto data-[state=active]:bg-[#BBA5FF] data-[state=active]:text-[#000]"
      value={value}
    >
      {label}
    </RadixTabs.Trigger>
  );
}
