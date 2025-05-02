import "./globals.css";

import type { LayoutProps } from "@zenncore/types/navigation";
import { cn } from "@zenncore/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "aadf",
  description: "aadf",
};

export default ({ children, navigation }: LayoutProps<"navigation">) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="flex items-center justify-between"
    >
      <body
        suppressHydrationWarning
        className={cn(
          "h-screen min-h-screen w-screen bg-accent font-sans text-foreground",
          "flex flex-row items-center",
        )}
      >
        {navigation}
        <main className={"grow h-full flex flex-col"}>
          <nav className={"h-12 w-full"} />
          <section
            className={"rounded-tl-lg bg-background grow w-full py-6 shadow-lg"}
          >
            {children}
          </section>
        </main>
      </body>
    </html>
  );
};
