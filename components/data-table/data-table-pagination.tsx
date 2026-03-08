"use client"

import { type Table } from "@tanstack/react-table"
import {
  IoChevronBack,
  IoChevronForward,
  IoPlayBack,
  IoPlayForward,
} from "react-icons/io5"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export const DataTablePagination = <TData,>({
  table,
}: DataTablePaginationProps<TData>) => (
  <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
    <div className="hidden text-sm text-muted-foreground sm:block">
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
    <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6 lg:gap-8">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Rows</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-sm font-medium tabular-nums">
        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <IoPlayBack size={14} />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <IoChevronBack size={14} />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <IoChevronForward size={14} />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <IoPlayForward size={14} />
        </Button>
      </div>
    </div>
  </div>
)
