import { ActionSheet } from "@/components/action-sheet";
import { OffersView } from "@/components/offers/offers-view";
import { SheetContent } from "@zennui/web/sheet";

export default () => {
  return (
    <ActionSheet>
      <SheetContent className="flex flex-col gap-6">
        <OffersView />
      </SheetContent>
    </ActionSheet>
  );
};
