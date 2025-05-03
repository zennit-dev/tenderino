"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./data-table-primitive";

import { flexRender } from "@tanstack/react-table";
import { useDataTableContext } from "@zenncore/components/data-table";
import type { ClassList } from "@zenncore/types";
import { cn } from "@zenncore/utils";
import { useRouter } from "next/navigation";

type DataTableSector = "row" | "cell" | "footer" | "table";
type DataTablePosition = "header" | "body" | "footer";
type DataTableClassListKey =
  | `${DataTablePosition}-${DataTableSector}`
  | "table";

export type DataTableProps = {
  classList?: ClassList<DataTableClassListKey>;
  className?: string;
};
export const DataTable = ({ className, classList }: DataTableProps) => {
  const { table } = useDataTableContext();
  const router = useRouter();
  return (
    <Table className={className}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="bg-background-dimmed">
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className={classList?.["header-cell"]}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.original.id.toString()}
              data-state={row.getIsSelected() && "selected"}
              className={cn("relative z-10", classList?.["body-row"])}
              onClick={() => {
                if (!row.original.href) return;

                router.prefetch(row.original.href);
                router.push(row.original.href);
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn("relative", classList?.["body-cell"])}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className={cn("h-24 text-center")}
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
