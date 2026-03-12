"use client"

import { useState, useCallback } from "react"
import { IoCalendarOutline, IoListOutline } from "react-icons/io5"
import { type ScheduleEntryWithInstructors } from "@/lib/db"
import { getAllAttendances, type AttendanceRecord } from "@/server-actions/attendance/get-all-attendances"
import { AttendanceView } from "./AttendanceView"
import { AttendanceHistoryTable } from "./attendance-history/AttendanceHistoryTable"

type View = "calendar" | "table"

const VIEWS: { id: View; label: string; icon: typeof IoCalendarOutline }[] = [
  { id: "calendar", label: "Calendar", icon: IoCalendarOutline },
  { id: "table", label: "Table", icon: IoListOutline },
]

const SUBTITLES: Record<View, string> = {
  calendar: "Select a date to view scheduled lessons.",
  table: "Full attendance log for investigation and management.",
}

interface AttendancePageClientProps {
  entries: ScheduleEntryWithInstructors[]
}

export const AttendancePageClient = ({ entries }: AttendancePageClientProps) => {
  const [view, setView] = useState<View>("calendar")
  const [tableData, setTableData] = useState<AttendanceRecord[] | null>(null)
  const [tableLoading, setTableLoading] = useState(false)

  const handleViewChange = useCallback(async (id: View) => {
    setView(id)
    if (id === "table") {
      setTableLoading(true)
      const result = await getAllAttendances()
      setTableData(result.success ? result.data ?? [] : [])
      setTableLoading(false)
    }
  }, [])

  return (
    <div>
      <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">{SUBTITLES[view]}</p>
        </div>

        <div className="flex w-fit shrink-0 rounded-lg border bg-muted p-1">
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleViewChange(id)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                view === id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "calendar" ? (
        <AttendanceView entries={entries} />
      ) : tableLoading || !tableData ? (
        <div className="flex items-center justify-center py-16">
          <span className="size-8 animate-spin rounded-full border-3 border-primary/30 border-t-primary" />
        </div>
      ) : (
        <AttendanceHistoryTable data={tableData} />
      )}
    </div>
  )
}
