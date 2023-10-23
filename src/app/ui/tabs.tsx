"use client";
import * as RadixTabs from "@radix-ui/react-tabs";
import { type ReactNode } from "react";

export type TabItemType = {
  /** Component that is the content of the Tab */
  content: ReactNode;
  /** Label shown in the Tab Trigger */
  label: string;
  /** Value of the Tab */
  value: string;
};

type TabsProps = {
  /** a11y label for the Trigger buttons list */
  ariaLabel?: string;
  /** Tab items */
  items: [TabItemType, TabItemType, ...TabItemType[]];
};

export default function Tabs(props: TabsProps) {
  const { ariaLabel, items } = props;

  return (
    <RadixTabs.Root
      className="flex w-full flex-col"
      defaultValue={items[0].value}
    >
      <RadixTabs.List
        aria-label={ariaLabel}
        className="flex w-full rounded-md bg-[#25272E] p-2"
      >
        {items.map((item) => {
          const { label, value } = item;
          return <TabItem key={value} label={label} value={value} />;
        })}
      </RadixTabs.List>
      {items.map((item) => {
        const { content, value } = item;
        return (
          <RadixTabs.Content className="flex-1" key={value} value={value}>
            {content}
          </RadixTabs.Content>
        );
      })}
    </RadixTabs.Root>
  );
}

function TabItem(props: Pick<TabItemType, "label" | "value">) {
  const { label, value } = props;

  return (
    <RadixTabs.Trigger
      className="flex-auto rounded-md p-2 data-[state=active]:bg-[#BBA5FF] data-[state=active]:text-black"
      value={value}
    >
      {label}
    </RadixTabs.Trigger>
  );
}
