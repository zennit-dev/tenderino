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
      <section className={"grow h-full flex flex-col"}>
        <nav className={"h-12 w-full"} />
        <section
          className={"rounded-tl-lg bg-background grow w-full shadow-lg p-4"}
        >
          {children}
        </section>
      </section>
      {action}
    </main>
  );
};
