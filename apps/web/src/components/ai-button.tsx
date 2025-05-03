import { AIIcon } from "@zennui/icons";
import { Button, type ButtonProps } from "@zennui/web/button";
import { cn } from "@zenncore/utils";

export const AIButton = ({ children, className, ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      className={cn(
        "bg-gradient-to-r border-none from-[#289BD6] to-[#D82657]",
        className
      )}
    >
      <AIIcon />
      {children}
    </Button>
  );
};
