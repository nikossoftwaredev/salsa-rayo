"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar as CalendarIcon, Clock, User, ChevronDown, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { getAttendanceCounts } from "@/server-actions/attendance/get-attendance-counts"
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

const toDateString = (date: Date) =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString()

export const AttendanceView = ({ entries }: AttendanceViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null)

  // Phase 1: lightweight counts per schedule entry (fast)
  const [countsMap, setCountsMap] = useState<Record<string, number> | null>(null)
  const countsFetchIdRef = useRef(0)

  // Phase 2: detailed attendance data per entry (lazy, on expand)
  const [detailMap, setDetailMap] = useState<Record<string, AttendanceRecord[]>>({})
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null)
  const dateFetchIdRef = useRef(0)

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

  const todayKey = new Date().toDateString()
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(23, 59, 59, 999)
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey])

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

  // Phase 1: fast count fetch on date change
  const loadCounts = useCallback(async () => {
    if (lessonsForDay.length === 0) return
    setCountsMap(null)
    setDetailMap({})
    setDetailLoadingId(null)
    const currentFetchId = ++countsFetchIdRef.current
    ++dateFetchIdRef.current // invalidate any in-flight detail fetches
    const dateStr = toDateString(selectedDate)

    const result = await getAttendanceCounts({ date: dateStr })

    if (countsFetchIdRef.current === currentFetchId) {
      setCountsMap(result.success ? result.data ?? {} : {})
    }
  }, [lessonsForDay, selectedDate])

  // Phase 2: detailed fetch for a single entry (on expand)
  const loadDetail = useCallback(async (entryId: string) => {
    setDetailLoadingId(entryId)
    const dateId = dateFetchIdRef.current
    const dateStr = toDateString(selectedDate)

    const result = await getAttendances({ scheduleEntryId: entryId, date: dateStr })

    if (dateFetchIdRef.current !== dateId) return // date changed, discard
    setDetailMap((prev) => ({
      ...prev,
      [entryId]: result.success ? result.data ?? [] : [],
    }))
    setDetailLoadingId((prev) => (prev === entryId ? null : prev))
  }, [selectedDate])

  const loadingCounts = countsMap === null

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
        const isCollapsing = expandedEntryId === entryId
        setExpandedEntryId((prev) => (prev === entryId ? null : entryId))
        resetPending()
        if (!isCollapsing && !detailMap[entryId]) loadDetail(entryId)
      }
      if (hasPendingRef.current) {
        unsavedActionRef.current = action
        setShowUnsavedDialog(true)
      } else action()
    },
    [resetPending, expandedEntryId, detailMap, loadDetail]
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

      // Optimistic: merge pending changes into local state (no re-fetch)
      setDetailMap((prev) => {
        const existing = prev[expandedEntryId] ?? []
        const afterRemoves = existing.filter((a) => !pendingRemoveIds.has(a.id))
        const newRecords: AttendanceRecord[] = pendingAdds.map((s) => ({
          id: crypto.randomUUID(),
          studentId: s.id,
          student: {
            name: s.name,
            rayoPoints: s.rayoPoints,
            subscriptions: s.subscriptions,
          },
        }))
        return { ...prev, [expandedEntryId]: [...afterRemoves, ...newRecords] }
      })

      setCountsMap((prev) => {
        if (!prev) return prev
        const existing = prev[expandedEntryId] ?? 0
        const newCount = existing - pendingRemoveIds.size + pendingAdds.length
        return { ...prev, [expandedEntryId]: newCount }
      })

      resetPending()
      setExpandedEntryId(null)
    } catch {
      toast.error("Failed to save attendance")
    } finally {
      setSubmitting(false)
    }
  }, [expandedEntryId, pendingAdds, pendingRemoveIds, lessonsForDay, selectedDate, resetPending])

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
    loadCounts()
  }, [loadCounts])

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Calendar panel */}
      <div className="shrink-0">
        <div className="mx-auto w-fit rounded-xl border bg-card p-2 lg:mx-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            weekStartsOn={1}
            startMonth={ESTABLISHED_DATE}
            endMonth={today}
            disabled={disabledDays}
            className="lg:block"
            classNames={{ month_grid: "lg:text-base" }}
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
                <CalendarIcon className="mb-3 size-8 opacity-40" />
                <p className="text-sm">No classes scheduled for {dayName}.</p>
              </div>
            ) : loadingCounts ? (
              <div className="flex items-center justify-center py-16">
                <span className="size-8 animate-spin rounded-full border-3 border-primary/30 border-t-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {lessonsForDay.map((entry, i) => {
                  const isExpanded = expandedEntryId === entry.id
                  const detail = detailMap[entry.id]
                  const isDetailLoading = detailLoadingId === entry.id

                  // Existing attendees (minus pending removes when expanded)
                  const existingVisible = detail
                    ? detail.filter((a) => isExpanded ? !pendingRemoveIds.has(a.id) : true)
                    : []

                  // Count badge: detail-aware when available, otherwise fast counts
                  const baseCount = detail ? detail.length : (countsMap?.[entry.id] ?? 0)
                  const effectiveCount = isExpanded
                    ? existingVisible.length + pendingAdds.length
                    : baseCount

                  // IDs to hide from the left panel
                  const hideIds = isExpanded
                    ? [...existingVisible.map((a) => a.studentId), ...pendingAdds.map((s) => s.id)]
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
                              <Clock className="size-3 shrink-0 opacity-60" />
                              <span>{entry.time}</span>
                            </div>
                          </div>

                          {/* Right: avatars + badge + chevron */}
                          <div className="flex shrink-0 items-center gap-2.5">
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
                            <span className="min-w-7 rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-center text-xs font-semibold tabular-nums text-yellow-500">
                              {effectiveCount}
                            </span>
                            <ChevronDown
                              className={`size-4 shrink-0 text-muted-foreground/50 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expanded panel: search left + attendees right */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 grid gap-3 lg:grid-cols-2 lg:gap-4">
                              {/* Left: student picker */}
                              <div className="h-[220px] sm:h-[300px] lg:h-[400px]">
                                <AttendancePanel
                                  hideIds={hideIds}
                                  onAddStudent={handleAddStudent}
                                />
                              </div>

                              {/* Right: attendees list */}
                              <div className="flex h-[220px] flex-col overflow-hidden rounded-xl border bg-card sm:h-[300px] lg:h-[400px]">
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
                                    {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                                    Save
                                  </Button>
                                </div>

                                {/* Scrollable body */}
                                <div className="min-h-0 flex-1 overflow-y-auto px-1 sm:px-4">
                                  {isDetailLoading ? (
                                    <div className="flex h-full items-center justify-center py-8">
                                      <span className="size-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                                    </div>
                                  ) : effectiveCount === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                                      <User className="mb-2 size-6 opacity-40" />
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
                                </div>
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
              {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
