import { AttendancePageClient } from "@/components/admin/attendance/AttendancePageClient"
import { getScheduleAdmin } from "@/server-actions/schedule/get-schedule"

const AttendancePage = async () => {
  const scheduleResult = await getScheduleAdmin()
  const entries = scheduleResult.success ? scheduleResult.data ?? [] : []

  return <AttendancePageClient entries={entries} />
}

export default AttendancePage
