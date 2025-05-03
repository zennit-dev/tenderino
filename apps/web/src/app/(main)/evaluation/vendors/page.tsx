import { VendorTable } from "@/components/vendor/vendor-table";
import { FilterIcon, XIcon } from "@zennui/icons";
import { Button } from "@zennui/web/button";
import { Input } from "@zennui/web/input";

export default () => {
  return (
    <main>
      <h1 className="text-3xl font-bold">All Vendors</h1>
      <p>Browse and apply for available procurement opportunities</p>
      <div className="flex gap-2">
        <Input placeholder="Search for vendor" />
        <Button className="px-4" color="accent">
          <FilterIcon />
          Filter
        </Button>
      </div>
      <hr className="my-4 bg-border border-border text-border" />
      <VendorTable />
    </main>
  );
};
