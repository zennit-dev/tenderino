import { AIIcon } from "@zennui/icons";
import { Button } from "@zennui/web/button";
import type { PropsWithChildren } from "react";

export const AIButton = ({ children }: PropsWithChildren) => {
  return (
    <Button className="bg-gradient-to-r border-none from-[#289BD6] to-[#D82657]">
      <AIIcon />
      {children}
    </Button>
  );
};
