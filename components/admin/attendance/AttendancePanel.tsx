"use client"

import { useMemo } from "react"
import { Search, User, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { useStudentSearch, type StudentForAttendance } from "@/hooks/use-student-search"
import { AttendeeRow } from "./AttendeeRow"

interface AttendancePanelProps {
  hideIds: string[]
  onAddStudent: (student: StudentForAttendance) => void
}

export type { StudentForAttendance }

const getLastAttendanceTime = (student: StudentForAttendance) =>
  student.attendances[0]?.createdAt
    ? new Date(student.attendances[0].createdAt).getTime()
    : 0

export const AttendancePanel = ({
  hideIds,
  onAddStudent,
}: AttendancePanelProps) => {
  const { search, students, loading, handleSearch } = useStudentSearch()

  const hideSet = useMemo(() => new Set(hideIds), [hideIds])

  const visibleStudents = useMemo(
    () =>
      [...students]
        .filter((s) => !hideSet.has(s.id))
        .sort((a, b) => getLastAttendanceTime(b) - getLastAttendanceTime(a)),
    [students, hideSet]
  )

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      {/* Search */}
      <div className="flex h-14 shrink-0 items-center border-b px-4">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search students..."
            maxLength={100}
            className="pl-9 pr-8"
          />
          {search && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Student list */}
      <ScrollArea className="min-h-0 flex-1">
        {loading ? (
          <div className="space-y-1 px-2 py-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-3.5 w-10" />
              </div>
            ))}
          </div>
        ) : visibleStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <User className="mb-2 size-6 opacity-40" />
            <p className="text-xs">
              {search ? "No students found." : "No students available."}
            </p>
          </div>
        ) : (
          <div className="px-2 py-2">
            {visibleStudents.map((student) => (
              <AttendeeRow
                key={student.id}
                student={{
                  name: student.name,
                  rayoPoints: student.rayoPoints,
                  subscriptionExpiresAt: student.subscriptions[0]?.expiresAt ?? null,
                }}
                onClick={() => onAddStudent(student)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
