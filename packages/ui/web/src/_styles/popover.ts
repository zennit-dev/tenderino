import { cva } from "class-variance-authority";

export const popoverContentVariants = cva(
  "z-50 min-w-32 divide-y divide-accent-foreground/50 overflow-hidden rounded-lg bg-accent text-foreground-dimmed shadow-lg",
);
export const popoverItemVariants = cva(
  "relative flex cursor-default select-none flex-row items-center gap-2 bg-transparent p-2 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-background-rich data-[disabled]:pointer-events-none data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary-rich data-[disabled]:opacity-50",
);
