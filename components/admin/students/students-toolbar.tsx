"use client"

import { type Table } from "@tanstack/react-table"
import { IoClose, IoPersonAdd } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { StudentFilter } from "@/components/data-table/student-filter"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { type StudentWithSubscriptions } from "./types"

const statusOptions = [
  { label: "Active", value: "true" },
  { label: "Expired", value: "false" },
]

interface StudentsToolbarProps {
  table: Table<StudentWithSubscriptions>
}

export const StudentsToolbar = ({ table }: StudentsToolbarProps) => {
  const isFiltered = table.getState().columnFilters.length > 0
  const openDialog = useDialogStore((state) => state.openDialog)
  const nameColumn = table.getColumn("name")

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <StudentFilter
          value={nameColumn?.getFilterValue() as string | undefined}
          onSelect={(id) => nameColumn?.setFilterValue(id)}
        />
        {table.getColumn("subStatus") && (
          <DataTableFacetedFilter
            column={table.getColumn("subStatus")}
            title="Sub Status"
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
            <IoClose size={14} className="ml-2" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
        <Button size="sm" onClick={() => openDialog("StudentDialog")}>
          <IoPersonAdd size={14} className="mr-2" />
          Add Student
        </Button>
      </div>
    </div>
  )
}
