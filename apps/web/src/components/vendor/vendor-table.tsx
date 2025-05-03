"use client";
import type { Vendor } from "@/types/vendor";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTableProvider } from "@zenncore/components/data-table";
import { DataTable, DataTablePagination } from "@zennui/web/data-table";

export const VendorTable = () => {
  return (
    <DataTableProvider columns={columns} rows={data}>
      <DataTable />
      <DataTablePagination />
    </DataTableProvider>
  );
};

const column = createColumnHelper<Vendor>();

const columns = [
  column.accessor("name", {
    header: "Name",
  }),
  column.accessor("email", {
    header: "Email",
  }),
  column.accessor("phone", {
    header: "Phone",
  }),
];

const data: Vendor[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "1234567890",
  },
  {
    id: "3",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
  },
];
