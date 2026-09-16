"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { type ScheduleEntryWithInstructors } from "@/lib/db"
import { DAY_NAMES } from "@/data/schedule"
import { getScheduleAdmin } from "@/server-actions/schedule/get-schedule"

interface ClassPickerProps {
  value: string[]
  onChange: (scheduleEntryIds: string[]) => void
  /** The package's weekly allowance, used to warn when more classes are ticked. */
  lessonsPerWeek?: number
}

export const ClassPicker = ({ value, onChange, lessonsPerWeek }: ClassPickerProps) => {
  const [entries, setEntries] = useState<ScheduleEntryWithInstructors[] | null>(null)
  const isMountedRef = useRef(true)

  const selected = useMemo(() => new Set(value), [value])

  const entriesByDay = useMemo(() => {
    const groups = new Map<number, ScheduleEntryWithInstructors[]>()
    for (const entry of entries ?? []) {
      groups.set(entry.dayIndex, [...(groups.get(entry.dayIndex) ?? []), entry])
    }
    return [...groups.entries()]
  }, [entries])

  const toggle = (id: string, checked: boolean) =>
    onChange(checked ? [...value, id] : value.filter((v) => v !== id))

  const isOverLimit = lessonsPerWeek !== undefined && value.length > lessonsPerWeek

  useEffect(() => {
    isMountedRef.current = true

    const load = async () => {
      const result = await getScheduleAdmin()
      if (isMountedRef.current) setEntries(result.success ? result.data : [])
    }
    load()

    return () => {
      isMountedRef.current = false
    }
  }, [])

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label>Classes</Label>
        <span className={`text-xs ${isOverLimit ? "text-amber-500" : "text-muted-foreground"}`}>
          {value.length}
          {lessonsPerWeek !== undefined && ` / ${lessonsPerWeek}`} per week
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Ticked classes are booked automatically in the attendance for the whole subscription period.
      </p>

      <div className="max-h-56 overflow-y-auto rounded-lg border px-3 py-2">
        {entries === null ? (
          <div className="flex justify-center py-4">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length === 0 ? (
          <p className="py-2 text-xs text-muted-foreground">No classes in the schedule.</p>
        ) : (
          entriesByDay.map(([dayIndex, dayEntries]) => (
            <div key={dayIndex} className="py-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                {DAY_NAMES[dayIndex - 1]}
              </p>
              {dayEntries.map((entry) => (
                <label
                  key={entry.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 text-sm hover:bg-accent"
                >
                  <Checkbox
                    checked={selected.has(entry.id)}
                    onCheckedChange={(checked) => toggle(entry.id, checked === true)}
                  />
                  <span className="w-24 shrink-0 tabular-nums text-muted-foreground">{entry.time}</span>
                  <span className="truncate">
                    {entry.title}
                    {entry.hint && <span className="text-muted-foreground"> - {entry.hint}</span>}
                  </span>
                </label>
              ))}
            </div>
          ))
        )}
      </div>

      {isOverLimit && (
        <p className="text-xs text-amber-500">
          More classes than the package includes ({lessonsPerWeek} per week).
        </p>
      )}
    </div>
  )
}
