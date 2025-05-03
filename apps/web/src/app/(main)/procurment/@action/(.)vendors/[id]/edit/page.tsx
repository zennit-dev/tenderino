import { ActionSheet } from "@/components/action-sheet";
import { VendorForm } from "@/components/vendor/vendor-form";
import { SheetContent } from "@zennui/web/sheet";

export default () => {
  return (
    <ActionSheet>
      <SheetContent>
        <VendorForm action="edit" defaultValues={data} />
      </SheetContent>
    </ActionSheet>
  );
};

const data = {
  id: "1",
  name: "Vendor 1",
  email: "vendor1@example.com",
  phone: "1234567890",
  address: "123 Main St, Anytown, USA",
};
