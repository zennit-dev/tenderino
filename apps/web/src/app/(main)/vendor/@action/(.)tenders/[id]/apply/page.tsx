import { ActionSheet } from "@/components/action-sheet";
import { ApplyForm } from "@/components/offers/apply-form";
import { SheetContent } from "@zennui/web/sheet";

export default () => {
  return (
    <ActionSheet>
      <SheetContent>
        <ApplyForm />
      </SheetContent>
    </ActionSheet>
  );
};
