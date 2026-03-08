"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { type VisibilityState } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "./columns"
import { AttendanceHistoryToolbar } from "./attendance-history-toolbar"
import { type AttendanceRecord } from "@/server-actions/attendance/get-all-attendances"

interface AttendanceHistoryTableProps {
  data: AttendanceRecord[]
}

const MOBILE_HIDDEN_COLUMNS = ["subscription", "classDate", "createdAt"] as const

const getInitialVisibility = (): VisibilityState => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640
  const vis: VisibilityState = { rayoPoints: false }
  if (isMobile) {
    for (const col of MOBILE_HIDDEN_COLUMNS) vis[col] = false
  }
  return vis
}

export const AttendanceHistoryTable = ({ data }: AttendanceHistoryTableProps) => {
  const router = useRouter()
  const initialVisibility = useMemo(() => getInitialVisibility(), [])

  const meta = useMemo(() => ({
    refresh: () => router.refresh(),
  }), [router])

  return (
    <DataTable
      columns={columns}
      data={data}
      toolbar={(table) => <AttendanceHistoryToolbar table={table} />}
      initialSorting={[{ id: "createdAt", desc: true }]}
      initialColumnVisibility={initialVisibility}
      storageKey="dt-col-attendance-history"
      meta={meta}
    />
  )
}
