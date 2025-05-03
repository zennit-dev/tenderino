import type { LayoutProps } from "@zenncore/types/navigation";

export default ({ children, action }: LayoutProps<"action">) => {
  return (
    <>
      {children}
      {action}
    </>
  );
};
