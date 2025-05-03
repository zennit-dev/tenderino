import SidePanel from "@/components/side-panel";
import type { LayoutProps } from "@zenncore/types/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "aadf",
  description: "aadf",
};

export default ({ children, action }: LayoutProps<"action">) => {
  return (
    <main className="flex flex-row items-center h-screen">
      <SidePanel />
      <section className={"h-screen flex overflow-auto flex-col"}>
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
