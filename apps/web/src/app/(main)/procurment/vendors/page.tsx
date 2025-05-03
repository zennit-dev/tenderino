"use client";
import { VendorTable } from "@/components/vendor/vendor-table";
import { EditIcon, FilterIcon, PlusCircleIcon, XIcon } from "@zennui/icons";
import { Button } from "@zennui/web/button";
import { Input } from "@zennui/web/input";
import Link from "next/link";

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
        <Link href="/procurment/vendors/create">
          <Button className="px-4" color="primary">
            <PlusCircleIcon />
            Add Vendor
          </Button>
        </Link>
      </div>
      <hr className="my-4 bg-border border-border text-border" />
      <VendorTable
        buildColumns={(column) => [
          column.display({
            id: "actions",
            cell: ({ row }) => (
              <Link href={`/procurment/vendors/${row.original.id}/edit`}>
                <Button variant="ghost" size="icon">
                  <EditIcon />
                </Button>
              </Link>
            ),
          }),
        ]}
      />
    </main>
  );
};
