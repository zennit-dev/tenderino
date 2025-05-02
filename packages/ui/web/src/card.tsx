import { cn } from "@zenncore/utils";
import type { HTMLProps } from "react";

export const Card = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-accent p-4",
        className,
      )}
      {...props}
    />
  );
};
