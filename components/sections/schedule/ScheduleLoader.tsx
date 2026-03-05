import { getSchedule } from "@/server-actions/schedule/get-schedule"
import ScheduleSection from "./ScheduleSection"

const ScheduleLoader = async () => {
  const result = await getSchedule()
  const entries = result.success ? result.data ?? [] : []

  return <ScheduleSection entries={entries} />
}

export default ScheduleLoader
