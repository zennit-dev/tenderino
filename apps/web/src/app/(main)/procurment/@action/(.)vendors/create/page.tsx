import { ActionSheet } from "@/components/action-sheet";
import { VendorForm } from "@/components/vendor/vendor-form";
import { SheetContent } from "@zennui/web/sheet";

export default () => {
  return (
    <ActionSheet>
      <SheetContent>
        <VendorForm action="create" />
      </SheetContent>
    </ActionSheet>
  );
};
