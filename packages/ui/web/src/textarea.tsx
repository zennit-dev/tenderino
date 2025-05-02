import { cn } from "@zenncore/utils";
import type { ComponentProps } from "react";

export type TextareaProps = ComponentProps<"textarea">;

export const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-border bg-accent p-2 text-foreground ring-offset-background placeholder:text-foreground-dimmed/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};
