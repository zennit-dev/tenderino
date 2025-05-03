"use client";
import type { Vendor } from "@/types/vendor";
import {
  type ColumnDef,
  type ColumnHelper,
  createColumnHelper,
} from "@tanstack/react-table";
import { DataTableProvider } from "@zenncore/components/data-table";
import { DataTable, DataTablePagination } from "@zennui/web/data-table";

type VendorTableProps = {
  buildColumns: (columnHelper: ColumnHelper<Vendor>) => ColumnDef<Vendor>[];
};
export const VendorTable = ({ buildColumns }: VendorTableProps) => {
  const additions = buildColumns(column);
  return (
    <DataTableProvider columns={[...columns, ...additions]} rows={data}>
      <DataTable />
      <DataTablePagination className="ml-auto" />
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
