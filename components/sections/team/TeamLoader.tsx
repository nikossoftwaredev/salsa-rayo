import { getTeam } from "@/server-actions/instructors/get-team"
import TeamSection from "./TeamSection"

const TeamLoader = async () => {
  const result = await getTeam()
  const members = result.success ? result.data : []

  // No instructors (or the DB is unreachable): drop the whole block rather
  // than leave an empty, padded "Our Team" heading on the homepage.
  if (members.length === 0) return null

  return (
    <div className="w-full py-24 px-4 md:px-8 relative">
      <TeamSection members={members} />
    </div>
  )
}

export default TeamLoader
