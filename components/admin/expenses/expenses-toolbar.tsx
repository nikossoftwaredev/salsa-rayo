"use client"

import { type Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { PAYMENT_METHODS } from "@/data/payment-constants"
import { type ExpenseWithCategory } from "@/server-actions/expenses/get-expenses"
import { type ExpenseCategory } from "@/lib/db"

const methodOptions = PAYMENT_METHODS.map((m) => ({ label: m.label, value: m.value }))

interface ExpensesToolbarProps {
  table: Table<ExpenseWithCategory>
  categories: ExpenseCategory[]
}

export const ExpensesToolbar = ({ table, categories }: ExpensesToolbarProps) => {
  const isFiltered = table.getState().columnFilters.length > 0

  const categoryOptions = categories.map((c) => ({ label: c.name, value: c.name }))

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by description..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          size="sm"
          className="w-[150px] lg:w-[250px]"
        />
        {table.getColumn("categoryName") && (
          <DataTableFacetedFilter
            column={table.getColumn("categoryName")}
            title="Category"
            options={categoryOptions}
          />
        )}
        {table.getColumn("paymentMethod") && (
          <DataTableFacetedFilter
            column={table.getColumn("paymentMethod")}
            title="Method"
            options={methodOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X className="size-3.5 ml-2" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
