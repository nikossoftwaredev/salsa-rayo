"use client"

import { type Table } from "@tanstack/react-table"
import { IoClose } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { PAYMENT_TYPES, PAYMENT_METHODS } from "@/data/payment-constants"
import { type TransactionWithStudent } from "@/server-actions/payments/get-transactions"

const typeOptions = PAYMENT_TYPES.map((t) => ({ label: t.label, value: t.value }))
const methodOptions = PAYMENT_METHODS.map((m) => ({ label: m.label, value: m.value }))

interface IncomeToolbarProps {
  table: Table<TransactionWithStudent>
}

export const IncomeToolbar = ({ table }: IncomeToolbarProps) => {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by student..."
          value={(table.getColumn("studentName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("studentName")?.setFilterValue(event.target.value)
          }
          size="sm"
          className="w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={typeOptions}
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
            <IoClose size={14} className="ml-2" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
