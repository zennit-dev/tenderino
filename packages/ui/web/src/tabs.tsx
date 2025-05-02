"use client";

import type { ComponentProps } from "react";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@zenncore/utils";

export type TabsProps = ComponentProps<typeof TabsPrimitive.Root>;
export const Tabs = TabsPrimitive.Root;

export type TabsListProps = ComponentProps<typeof TabsPrimitive.List>;
export const TabsList = ({ className, ...props }: TabsListProps) => (
  <TabsPrimitive.List
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-accent p-1 text-foreground",
      className,
    )}
    {...props}
  />
);

export type TabsTriggerProps = ComponentProps<typeof TabsPrimitive.Trigger>;
export const TabsTrigger = ({ className, ...props }: TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className,
    )}
    {...props}
  />
);

export type TabsContentProps = ComponentProps<typeof TabsPrimitive.Content>;
export const TabsContent = ({ className, ...props }: TabsContentProps) => (
  <TabsPrimitive.Content
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
);
