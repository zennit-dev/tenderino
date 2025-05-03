import type { LayoutProps } from "@zenncore/types/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "aadf",
  description: "aadf",
};

export default ({
  children,
  navigation,
  action,
}: LayoutProps<"navigation" | "action">) => {
  return (
    <main className="flex flex-row items-center size-full">
      {navigation}
      <section
        className={"grow h-full flex flex-col  min-w-[calc(100%-60px)] h-full"}
      >
        <nav className={"h-12 w-full min-h-12"} />
        <section
          className={
            "rounded-tl-lg bg-background grow w-full shadow-lg p-4 border border-border  overflow-y-auto overflow-x-hidden w-full min-h-[calc(100vh-theme(spacing.12))]"
          }
        >
          {children}
        </section>
      </section>
      {action}
    </main>
  );
};
