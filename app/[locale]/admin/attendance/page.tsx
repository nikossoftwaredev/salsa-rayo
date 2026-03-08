import { AttendanceView } from "@/components/admin/attendance/AttendanceView"
import { AttendanceHistoryTable } from "@/components/admin/attendance/attendance-history/AttendanceHistoryTable"
import { getSchedule } from "@/server-actions/schedule/get-schedule"
import { getAllAttendances } from "@/server-actions/attendance/get-all-attendances"

const AttendancePage = async () => {
  const [scheduleResult, attendancesResult] = await Promise.all([
    getSchedule(),
    getAllAttendances(),
  ])
  const entries = scheduleResult.success ? scheduleResult.data ?? [] : []
  const attendances = attendancesResult.success ? attendancesResult.data ?? [] : []

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
        <p className="text-muted-foreground">
          Select a date to view scheduled lessons.
        </p>
      </div>
      <AttendanceView entries={entries} />

      <div className="mt-10">
        <div className="mb-4">
          <h3 className="text-lg font-semibold tracking-tight">Attendance History</h3>
          <p className="text-sm text-muted-foreground">
            Full attendance log for investigation and management.
          </p>
        </div>
        <AttendanceHistoryTable data={attendances} />
      </div>
    </div>
  )
}

export default AttendancePage
