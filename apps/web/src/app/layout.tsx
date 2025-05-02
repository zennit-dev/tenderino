import "./globals.css";

import type { LayoutProps } from "@zenncore/types/navigation";
import { cn } from "@zenncore/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "aadf",
  description: "aadf",
};

export default ({ children }: LayoutProps) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="flex items-center justify-between"
    >
      <body
        suppressHydrationWarning
        className={cn(
          "h-screen min-h-screen w-screen bg-background font-sans text-foreground mx-auto max-w-screen-2xl",
        )}
      >
        {children}
      </body>
    </html>
  );
};
