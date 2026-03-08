"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "./columns"
import { AttendanceHistoryToolbar } from "./attendance-history-toolbar"
import { type AttendanceRecord } from "@/server-actions/attendance/get-all-attendances"

interface AttendanceHistoryTableProps {
  data: AttendanceRecord[]
}

export const AttendanceHistoryTable = ({ data }: AttendanceHistoryTableProps) => {
  const router = useRouter()

  const meta = useMemo(() => ({
    refresh: () => router.refresh(),
  }), [router])

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={(table) => <AttendanceHistoryToolbar table={table} />}
      initialSorting={[{ id: "createdAt", desc: true }]}
      initialColumnVisibility={{ rayoPoints: false }}
      storageKey="dt-col-attendance-history"
      meta={meta}
    />
  )
}
