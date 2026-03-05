"use client"

import { useState } from "react"
import { type Table } from "@tanstack/react-table"
import { IoClose, IoPersonAdd } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { AddStudentModal } from "./AddStudentModal"
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

  const [addModalOpen, setAddModalOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter students..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          size="sm"
          className="w-[150px] lg:w-[250px]"
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
        <Button size="sm" onClick={() => setAddModalOpen(true)}>
          <IoPersonAdd size={14} className="mr-2" />
          Add Student
        </Button>
      </div>

      <AddStudentModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </div>
  )
}
