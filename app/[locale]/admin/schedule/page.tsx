import { ScheduleEditor } from "@/components/admin/schedule/ScheduleEditor"
import { SeedScheduleButton } from "@/components/admin/schedule/SeedScheduleButton"
import { getSchedule } from "@/server-actions/schedule/get-schedule"
import { getInstructors } from "@/server-actions/instructors/get-instructors"

const SchedulePage = async () => {
  const [scheduleResult, instructorsResult] = await Promise.all([
    getSchedule(),
    getInstructors(),
  ])

  const entries = scheduleResult.success ? scheduleResult.data ?? [] : []
  const instructors = instructorsResult.success ? instructorsResult.data ?? [] : []

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Schedule</h2>
          <p className="text-muted-foreground">
            Manage your weekly class schedule.
          </p>
        </div>
        {entries.length === 0 && <SeedScheduleButton />}
      </div>
      <ScheduleEditor entries={entries} instructors={instructors} />
    </div>
  )
}

export default SchedulePage
