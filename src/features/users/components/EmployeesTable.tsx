"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { trpc } from "@/lib/trpc/client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import { columns as UserColumns } from "./users-columns";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableUser } from "../types";
import { DataTableToolbar } from "./data-table-toolbar";

export function EmployeesTable() {
  const searchParams = useSearchParams();
  const searchEmployee = searchParams.get("query") || "";
  const debouncedSearchQuery = useDebounce(searchEmployee || "", 1000);

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo(() => UserColumns, []);
  const [toggle, setToggle] = useState(false);
  const { data: employees, isLoading } = trpc.user.getUsers.useQuery(
    {
      searchEmployee: debouncedSearchQuery,
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  const table = useReactTable<TableUser>({
    data: employees?.users ?? [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <DataTableToolbar table={table} />
      {/* <SheetSide toggle={toggle} setToggle={setToggle} /> */}
      <Table className="mt-3">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="group/row">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    // className={header.column.columnDef.meta?.className ?? ""}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="group/row"
                onClick={() => setToggle(true)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    // className={cell.column.columnDef.meta?.className ?? ""}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
{
}

type sheetInterface = {
  toggle: boolean;
  setToggle: () => void;
};
export function SheetSide({ toggle, setToggle }: sheetInterface) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet open={toggle} onOpenChange={setToggle}>
        <SheetContent side={"right"}>
          <SheetHeader>
            <SheetTitle>View Profile</SheetTitle>
            <SheetDescription>
              View the information of your employee here
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4"></div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
