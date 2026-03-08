"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoChevronDown,
} from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type ScheduleEntryWithInstructors } from "@/lib/db"
import { DAY_NAMES } from "@/data/schedule"
import { getAttendances, type AttendanceRecord } from "@/server-actions/attendance/get-attendances"
import { submitAttendance } from "@/server-actions/attendance/submit-attendance"
import { removeAttendance } from "@/server-actions/attendance/remove-attendance"
import { AttendancePanel, type StudentForAttendance } from "./AttendancePanel"
import { AttendeeRow } from "./AttendeeRow"
import { ESTABLISHED_DATE } from "@/data/config"

interface AttendanceViewProps {
  entries: ScheduleEntryWithInstructors[]
}

const toDayIndex = (date: Date) => {
  const jsDay = date.getDay()
  return jsDay === 0 ? 7 : jsDay
}

const toDateString = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export const AttendanceView = ({ entries }: AttendanceViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null)

  // Map of scheduleEntryId -> AttendanceRecord[]
  const [attendancesMap, setAttendancesMap] = useState<Record<string, AttendanceRecord[]> | null>(null)
  const fetchIdRef = useRef(0)

  // Pending local changes (not yet saved)
  const [pendingAdds, setPendingAdds] = useState<StudentForAttendance[]>([])
  const [pendingRemoveIds, setPendingRemoveIds] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const unsavedActionRef = useRef<(() => void) | null>(null)

  const dayIndex = toDayIndex(selectedDate)
  const dayName = DAY_NAMES[dayIndex - 1]

  const activeDayIndices = useMemo(
    () => new Set(entries.map((e) => e.dayIndex)),
    [entries]
  )

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(23, 59, 59, 999)
    return d
  }, [])

  const disabledDays = useMemo(
    () => [
      (date: Date) => !activeDayIndices.has(toDayIndex(date)),
      { before: ESTABLISHED_DATE, after: today },
    ],
    [activeDayIndices, today]
  )

  const lessonsForDay = useMemo(
    () => entries.filter((e) => e.dayIndex === dayIndex),
    [entries, dayIndex]
  )

  const formattedDate = selectedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const loadAttendances = useCallback(async () => {
    if (lessonsForDay.length === 0) return
    setAttendancesMap(null)
    const currentFetchId = ++fetchIdRef.current
    const dateStr = toDateString(selectedDate)

    const results = await Promise.all(
      lessonsForDay.map(async (entry) => {
        const result = await getAttendances({ scheduleEntryId: entry.id, date: dateStr })
        return { entryId: entry.id, data: result.success ? result.data ?? [] : [] }
      })
    )

    if (fetchIdRef.current === currentFetchId) {
      const map: Record<string, AttendanceRecord[]> = {}
      for (const r of results) map[r.entryId] = r.data
      setAttendancesMap(map)
    }
  }, [lessonsForDay, selectedDate])

  const loadingAttendances = attendancesMap === null

  const resetPending = useCallback(() => {
    setPendingAdds([])
    setPendingRemoveIds(new Set())
  }, [])

  const hasPendingChanges = pendingAdds.length > 0 || pendingRemoveIds.size > 0
  const hasPendingRef = useRef(hasPendingChanges)
  hasPendingRef.current = hasPendingChanges

  const handleCardClick = useCallback(
    (entryId: string) => {
      const action = () => {
        setExpandedEntryId((prev) => (prev === entryId ? null : entryId))
        resetPending()
      }
      if (hasPendingRef.current) {
        unsavedActionRef.current = action
        setShowUnsavedDialog(true)
      } else action()
    },
    [resetPending]
  )

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return
      const action = () => {
        setSelectedDate(date)
        setExpandedEntryId(null)
        resetPending()
      }
      if (hasPendingRef.current) {
        unsavedActionRef.current = action
        setShowUnsavedDialog(true)
      } else action()
    },
    [resetPending]
  )

  const handleAddStudent = useCallback(
    (student: StudentForAttendance) => {
      setPendingAdds((prev) => [...prev, student])
    },
    []
  )

  const handleUndoAdd = useCallback(
    (studentId: string) => {
      setPendingAdds((prev) => prev.filter((s) => s.id !== studentId))
    },
    []
  )

  const handleMarkRemove = useCallback(
    (attendanceId: string) => {
      setPendingRemoveIds((prev) => new Set([...prev, attendanceId]))
    },
    []
  )

  const handleGlobalSubmit = useCallback(async () => {
    if (!expandedEntryId) return
    setSubmitting(true)

    try {
      const promises: Promise<unknown>[] = []

      // Remove attendances
      for (const attendanceId of pendingRemoveIds) {
        promises.push(removeAttendance(attendanceId))
      }

      // Add new attendances
      if (pendingAdds.length > 0) {
        const entry = lessonsForDay.find((e) => e.id === expandedEntryId)
        if (entry) {
          promises.push(submitAttendance({
            scheduleEntryId: expandedEntryId,
            date: toDateString(selectedDate),
            studentIds: pendingAdds.map((s) => s.id),
            instructorIds: entry.instructors.map((ins) => ins.id),
          }))
        }
      }

      await Promise.all(promises)
      resetPending()
      loadAttendances()
    } catch {
      // Silent fail — the user can retry
    } finally {
      setSubmitting(false)
    }
  }, [expandedEntryId, pendingAdds, pendingRemoveIds, lessonsForDay, selectedDate, resetPending, loadAttendances])

  const handleUnsavedSave = useCallback(async () => {
    await handleGlobalSubmit()
    setShowUnsavedDialog(false)
    unsavedActionRef.current?.()
    unsavedActionRef.current = null
  }, [handleGlobalSubmit])

  const handleUnsavedDiscard = useCallback(() => {
    setShowUnsavedDialog(false)
    resetPending()
    unsavedActionRef.current?.()
    unsavedActionRef.current = null
  }, [resetPending])

  useEffect(() => {
    loadAttendances()
  }, [loadAttendances])

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Calendar panel */}
      <div className="shrink-0">
        <div className="rounded-xl border bg-card p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            weekStartsOn={1}
            startMonth={ESTABLISHED_DATE}
            endMonth={today}
            disabled={disabledDays}
          />
        </div>
      </div>

      {/* Lessons panel */}
      <div className="flex-1">
        <div className="mb-6 flex items-baseline gap-3">
          <h3 className="text-2xl font-bold tracking-tight">{dayName}</h3>
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={dayIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {lessonsForDay.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-muted-foreground">
                <IoCalendarOutline size={32} className="mb-3 opacity-40" />
                <p className="text-sm">No classes scheduled for {dayName}.</p>
              </div>
            ) : loadingAttendances ? (
              <div className="flex items-center justify-center py-16">
                <span className="size-8 animate-spin rounded-full border-3 border-primary/30 border-t-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {lessonsForDay.map((entry, i) => {
                  const attendees = attendancesMap?.[entry.id] ?? []
                  const isExpanded = expandedEntryId === entry.id

                  // Effective attendees: existing (minus pending removes) + pending adds
                  const existingVisible = isExpanded
                    ? attendees.filter((a) => !pendingRemoveIds.has(a.id))
                    : attendees
                  const effectiveCount = isExpanded
                    ? existingVisible.length + pendingAdds.length
                    : attendees.length

                  // IDs to hide from the left panel
                  const hideIds = isExpanded
                    ? [
                        ...existingVisible.map((a) => a.studentId),
                        ...pendingAdds.map((s) => s.id),
                      ]
                    : []

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.06 }}
                    >
                      {/* Lesson card */}
                      <div
                        onClick={() => handleCardClick(entry.id)}
                        className={`group relative cursor-pointer overflow-hidden rounded-xl border bg-card transition-colors ${isExpanded ? "border-primary/40" : "hover:border-primary/30"}`}
                      >
                        {/* Accent bar */}
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-brand-pink" />

                        <div className="flex items-center gap-3 py-4 pr-4 pl-5">
                          {/* Left: title block */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-semibold">{entry.title}</span>
                              {entry.hint && (
                                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                  {entry.hint}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <IoTimeOutline size={12} className="shrink-0 opacity-60" />
                              <span>{entry.time}</span>
                            </div>
                          </div>

                          {/* Right: badge + avatars + chevron */}
                          <div className="flex shrink-0 items-center gap-2.5">
                            {effectiveCount > 0 && (
                              <span className="rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-yellow-500">
                                {effectiveCount}
                              </span>
                            )}
                            <div className="hidden sm:flex shrink-0 -space-x-2">
                              {entry.instructors.map((instructor) => (
                                <div
                                  key={instructor.id}
                                  className="relative size-7 rounded-full ring-2 ring-card"
                                  title={instructor.name}
                                >
                                  <Image
                                    src={instructor.image}
                                    alt={instructor.name}
                                    fill
                                    className="rounded-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                            <IoChevronDown
                              size={16}
                              className={`shrink-0 text-muted-foreground/50 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expanded panel: search left + attendees right */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="mt-2 grid max-h-[70vh] gap-4 lg:grid-cols-2">
                              {/* Left: student picker */}
                              <div className="h-[300px] lg:h-[400px]">
                                <AttendancePanel
                                  hideIds={hideIds}
                                  onAddStudent={handleAddStudent}
                                />
                              </div>

                              {/* Right: attendees list */}
                              <div className="flex h-[300px] flex-col overflow-hidden rounded-xl border bg-card lg:h-[400px]">
                                {/* Header with save */}
                                <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
                                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                                    Attendees ({effectiveCount})
                                  </p>
                                  <Button
                                    size="sm"
                                    disabled={!hasPendingChanges || submitting}
                                    onClick={handleGlobalSubmit}
                                  >
                                    {submitting ? "Saving..." : "Save"}
                                  </Button>
                                </div>

                                {/* Scrollable body */}
                                <ScrollArea className="min-h-0 flex-1 px-4">
                                  {loadingAttendances ? (
                                    <div className="flex h-full items-center justify-center py-8">
                                      <span className="size-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                                    </div>
                                  ) : effectiveCount === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                                      <IoPersonOutline size={24} className="mb-2 opacity-40" />
                                      <p className="text-xs">No attendees for this date</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-1 py-2">
                                      {existingVisible.map((a) => (
                                        <AttendeeRow
                                          key={a.id}
                                          student={{
                                            name: a.student.name,
                                            rayoPoints: a.student.rayoPoints,
                                            subscriptionExpiresAt: a.student.subscriptions[0]?.expiresAt ?? null,
                                          }}
                                          onRemove={() => handleMarkRemove(a.id)}
                                        />
                                      ))}
                                      {pendingAdds.map((s) => (
                                        <AttendeeRow
                                          key={s.id}
                                          student={{
                                            name: s.name,
                                            rayoPoints: s.rayoPoints,
                                            subscriptionExpiresAt: s.subscriptions[0]?.expiresAt ?? null,
                                          }}
                                          onRemove={() => handleUndoAdd(s.id)}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </ScrollArea>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AlertDialog open={showUnsavedDialog} onOpenChange={(o) => { if (!o) { setShowUnsavedDialog(false); unsavedActionRef.current = null } }}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved attendance changes. Would you like to save or discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2 sm:justify-end">
            <Button variant="outline" onClick={handleUnsavedDiscard}>
              Discard
            </Button>
            <Button onClick={handleUnsavedSave} disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
