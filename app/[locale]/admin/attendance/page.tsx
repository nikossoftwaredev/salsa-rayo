import { AttendanceView } from "@/components/admin/attendance/AttendanceView"
import { getSchedule } from "@/server-actions/schedule/get-schedule"

const AttendancePage = async () => {
  const scheduleResult = await getSchedule()
  const entries = scheduleResult.success ? scheduleResult.data ?? [] : []

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
        <p className="text-muted-foreground">
          Select a date to view scheduled lessons.
        </p>
      </div>
      <AttendanceView entries={entries} />
    </div>
  )
}

export default AttendancePage
