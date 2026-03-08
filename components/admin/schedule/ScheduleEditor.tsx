"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { useConfirmStore } from "@/lib/stores/confirm-store"
import { deleteScheduleEntry } from "@/server-actions/schedule/delete-schedule-entry"
import { DIALOG_KEY } from "@/components/admin/schedule/ScheduleEntryDialog"
import { type Instructor, type ScheduleEntryWithInstructors } from "@/lib/db"
import { DAY_NAMES } from "@/data/schedule"
import { IoAdd, IoCreateOutline, IoTrashOutline } from "react-icons/io5"

interface ScheduleEditorProps {
  entries: ScheduleEntryWithInstructors[]
  instructors: Instructor[]
}

export const ScheduleEditor = ({ entries, instructors }: ScheduleEditorProps) => {
  const router = useRouter()
  const { openDialog } = useDialogStore()
  const { confirm } = useConfirmStore()

  const entriesByDay = entries.reduce<Record<number, ScheduleEntryWithInstructors[]>>(
    (acc, entry) => {
      if (!acc[entry.dayIndex]) acc[entry.dayIndex] = []
      acc[entry.dayIndex].push(entry)
      return acc
    },
    {}
  )

  const handleAdd = (dayIndex: number) => {
    openDialog(DIALOG_KEY, { entry: null, instructors, dayIndex })
  }

  const handleEdit = (entry: ScheduleEntryWithInstructors) => {
    openDialog(DIALOG_KEY, { entry, instructors, dayIndex: entry.dayIndex })
  }

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Class",
      description: "Are you sure you want to delete this class?",
      onConfirm: async () => {
        const result = await deleteScheduleEntry(id)
        if (result.success) router.refresh()
      },
    })
  }

  return (
    <div className="space-y-6">
      {DAY_NAMES.map((dayName, index) => {
        const dayIndex = index + 1
        const dayEntries = entriesByDay[dayIndex] ?? []

        return (
          <div key={dayIndex} className="rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-lg font-semibold">{dayName}</h3>
              <Button size="sm" variant="outline" onClick={() => handleAdd(dayIndex)}>
                <IoAdd className="!size-4" />
                Add Class
              </Button>
            </div>

            {dayEntries.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                No classes scheduled
              </p>
            ) : (
              <div className="divide-y">
                {dayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{entry.title}</span>
                        {entry.hint && (
                          <span className="shrink-0 text-sm text-muted-foreground">
                            ({entry.hint})
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{entry.time}</span>
                        <div className="flex shrink-0 items-center -space-x-1">
                          {entry.instructors.map((instructor) => (
                            <div key={instructor.id} className="relative size-5 ring-1 ring-card rounded-full" title={instructor.name}>
                              <Image
                                src={instructor.image}
                                alt={instructor.name}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(entry)}
                      >
                        <IoCreateOutline className="!size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <IoTrashOutline className="!size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
