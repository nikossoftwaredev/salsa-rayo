"use client"

import { type Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { StudentFilter } from "@/components/data-table/student-filter"
import { type SubscriptionWithDetails } from "@/server-actions/subscriptions/get-subscriptions"

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
]

interface SubscriptionsToolbarProps {
  table: Table<SubscriptionWithDetails>
}

export const SubscriptionsToolbar = ({ table }: SubscriptionsToolbarProps) => {
  const isFiltered = table.getState().columnFilters.length > 0
  const column = table.getColumn("studentName")

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <StudentFilter
          value={column?.getFilterValue() as string | undefined}
          onSelect={(id) => column?.setFilterValue(id)}
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statusOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X className="ml-2 size-3.5" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
