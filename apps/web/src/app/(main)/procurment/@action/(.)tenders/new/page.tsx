import { ActionSheet } from "@/components/action-sheet";
import { SheetContent } from "@zennui/web/sheet";
import { TenderForm } from "@/components/tender/tender-form";

export default () => {
  return (
    <ActionSheet>
      <SheetContent className="flex flex-col gap-6">
        <TenderForm />
      </SheetContent>
    </ActionSheet>
  );
};
