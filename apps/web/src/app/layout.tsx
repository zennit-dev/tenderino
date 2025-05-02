import "./globals.css";

import { cn } from "@zenncore/utils";
import type { LayoutProps } from "@zenncore/types/navigation";

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
          "h-screen min-h-screen w-screen bg-accent font-sans text-foreground"
        )}
      >
        {children}
      </body>
    </html>
  );
};
