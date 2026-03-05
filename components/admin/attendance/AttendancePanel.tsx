"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { IoSearchOutline, IoPersonOutline } from "react-icons/io5"
import { RayoPoints } from "@/components/ui/rayo-points"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getStudentsForAttendance,
  type StudentForAttendance,
} from "@/server-actions/students/get-students-for-attendance"

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
  const [search, setSearch] = useState("")
  const [students, setStudents] = useState<StudentForAttendance[] | null>(null)
  const [searching, setSearching] = useState(false)
  const isMountedRef = useRef(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const loading = students === null || searching

  const hideSet = useMemo(() => new Set(hideIds), [hideIds])

  const visibleStudents = useMemo(
    () =>
      [...(students ?? [])]
        .filter((s) => !hideSet.has(s.id))
        .sort((a, b) => getLastAttendanceTime(b) - getLastAttendanceTime(a)),
    [students, hideSet]
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    clearTimeout(debounceRef.current)
    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      const result = await getStudentsForAttendance({ search: value })
      if (isMountedRef.current) {
        setStudents(result.success ? result.data ?? [] : [])
        setSearching(false)
      }
    }, 300)
  }

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true

    const doFetch = async () => {
      const result = await getStudentsForAttendance({ search: "" })
      if (isMountedRef.current) {
        setStudents(result.success ? result.data ?? [] : [])
      }
    }

    doFetch()

    return () => {
      isMountedRef.current = false
      clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      {/* Search */}
      <div className="border-b px-4 py-3">
        <div className="relative">
          <IoSearchOutline size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search students..."
            maxLength={100}
            className="pl-9"
          />
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
            <IoPersonOutline size={24} className="mb-2 opacity-40" />
            <p className="text-xs">
              {search ? "No students found." : "No students available."}
            </p>
          </div>
        ) : (
          <div className="px-2 py-2">
            {visibleStudents.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                onAdd={onAddStudent}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

interface StudentRowProps {
  student: StudentForAttendance
  onAdd: (student: StudentForAttendance) => void
}

const StudentRow = ({ student, onAdd }: StudentRowProps) => (
  <button
    type="button"
    onClick={() => onAdd(student)}
    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
  >
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium">{student.name}</p>
      <p className="truncate text-xs text-muted-foreground">{student.email}</p>
    </div>
    <RayoPoints points={student.rayoPoints} size="sm" />
  </button>
)
