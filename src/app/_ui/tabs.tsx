"use client";
import * as RadixTabs from "@radix-ui/react-tabs";
import Divider from "./divider";
import { ReactNode } from "react";

export type TabItemType = {
  content: ReactNode;
  label: string;
  value: string;
};

export interface TabsProps {
  ariaLabel?: string;
  defaultValue: string;
  items: TabItemType[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function Tabs({ ariaLabel, defaultValue, items }: TabsProps) {
  return (
    <RadixTabs.Root
      className="flex w-full flex-col"
      defaultValue={defaultValue ?? items[0].value}
    >
      <RadixTabs.List aria-label={ariaLabel} className="flex h-[4.75rem] shrink-0 gap-2 px-4">
        {items.map((item) => (
          <RadixTabs.Trigger key={item.value} className="flex-auto flex-grow-0 border-b-2 border-transparent p-2 text-neutral-400 transition-colors data-[state=active]:border-white data-[state=active]:text-white hover:data-[state=inactive]:hover:border-neutral-600" value={item.value}>
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      <Divider />
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className="flex-1">
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
