import { InstructorsGrid } from "@/components/admin/instructors/InstructorsGrid"
import { getInstructors } from "@/server-actions/instructors/get-instructors"

const InstructorsPage = async () => {
  const result = await getInstructors()
  const instructors = result.success ? result.data ?? [] : []

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Instructors</h2>
        <p className="text-muted-foreground">
          Manage your dance instructors and their profiles.
        </p>
      </div>
      <InstructorsGrid data={instructors} />
    </div>
  )
}

export default InstructorsPage
