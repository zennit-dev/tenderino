"use client";

import { Sheet } from "@zennui/web/sheet";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";

export const ActionSheet = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };
  return (
    <Sheet onOpenChange={handleOpenChange} defaultOpen>
      {children}
    </Sheet>
  );
};
