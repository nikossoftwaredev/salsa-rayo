import { ScheduleEditor } from "@/components/admin/schedule/ScheduleEditor"
import { getScheduleAdmin } from "@/server-actions/schedule/get-schedule"
import { getInstructors } from "@/server-actions/instructors/get-instructors"

const SchedulePage = async () => {
  const [scheduleResult, instructorsResult] = await Promise.all([
    getScheduleAdmin(),
    getInstructors(),
  ])

  const entries = scheduleResult.success ? scheduleResult.data ?? [] : []
  const instructors = instructorsResult.success ? instructorsResult.data ?? [] : []

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Schedule</h2>
        <p className="text-muted-foreground">
          Manage your weekly class schedule.
        </p>
      </div>
      <ScheduleEditor entries={entries} instructors={instructors} />
    </div>
  )
}

export default SchedulePage
