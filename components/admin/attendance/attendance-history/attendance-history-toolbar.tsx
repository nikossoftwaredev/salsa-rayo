"use client"

import { useMemo } from "react"
import { type Table } from "@tanstack/react-table"
import { IoClose } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { StudentFilter } from "@/components/data-table/student-filter"
import { type AttendanceRecord } from "@/server-actions/attendance/get-all-attendances"

interface AttendanceHistoryToolbarProps {
  table: Table<AttendanceRecord>
}

export const AttendanceHistoryToolbar = ({ table }: AttendanceHistoryToolbarProps) => {
  const isFiltered = table.getState().columnFilters.length > 0
  const column = table.getColumn("studentName")

  const coreRows = table.getCoreRowModel().rows
  const classOptions = useMemo(() => {
    const titles = new Set<string>()
    for (const row of coreRows) {
      titles.add(row.original.danceClass.scheduleEntry.title)
    }
    return Array.from(titles)
      .sort()
      .map((title) => ({ label: title, value: title }))
  }, [coreRows])

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <StudentFilter
          value={column?.getFilterValue() as string | undefined}
          onSelect={(id) => column?.setFilterValue(id)}
        />
        {table.getColumn("class") && (
          <DataTableFacetedFilter
            column={table.getColumn("class")}
            title="Class"
            options={classOptions}
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
