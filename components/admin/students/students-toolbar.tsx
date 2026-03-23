"use client"

import { type Table } from "@tanstack/react-table"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { StudentFilter } from "@/components/data-table/student-filter"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { type StudentWithSubscriptions } from "./types"

interface StudentsToolbarProps {
  table: Table<StudentWithSubscriptions>
}

export const StudentsToolbar = ({ table }: StudentsToolbarProps) => {
  const isFiltered = table.getState().columnFilters.length > 0
  const openDialog = useDialogStore((state) => state.openDialog)
  const nameColumn = table.getColumn("name")

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        <StudentFilter
          value={nameColumn?.getFilterValue() as string | undefined}
          onSelect={(id) => nameColumn?.setFilterValue(id)}
        />
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
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button size="sm" onClick={() => openDialog("StudentDialog")} className="sm:px-3">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Add Student</span>
        </Button>
      </div>
    </div>
  )
}
