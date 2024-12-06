"use client";
import * as RadixTabs from "@radix-ui/react-tabs";
import { type ReactNode } from "react";

import Divider from "./divider";

export type TabItemType = {
  /** Component that is the content of the Tab */
  content: ReactNode;
  /** Label shown in the Tab Trigger */
  label: string;
  /** Value of the Tab */
  value: string;
};

type TabsProps = {
  ariaLabel?: string;
  defaultValue: string;
  items: [TabItemType, TabItemType, ...TabItemType[]];
  value?: string;
  onValueChange?: (value: string) => void;
};

export default function Tabs({ ariaLabel, defaultValue, items }: TabsProps) {
  return (
    <RadixTabs.Root
      className="flex w-full flex-col"
      defaultValue={defaultValue ?? items[0].value}
    >
      <RadixTabs.List
        aria-label={ariaLabel}
        className="flex h-[2.5rem] shrink-0 gap-2 px-4"
      >
        {items.map((item) => {
          const { label, value } = item;
          return <TabItem key={value} label={label} value={value} />;
        })}
      </RadixTabs.List>
      <Divider />
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
      className="flex-auto flex-grow-0 border-b-2 border-transparent p-2 text-neutral-400 transition-colors data-[state=active]:border-white data-[state=active]:text-white hover:data-[state=inactive]:hover:border-neutral-600"
      value={value}
    >
      {label}
    </RadixTabs.Trigger>
  );
}
