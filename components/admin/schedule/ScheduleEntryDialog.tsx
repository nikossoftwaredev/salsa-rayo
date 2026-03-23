"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Save, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { createScheduleEntry } from "@/server-actions/schedule/create-schedule-entry"
import { updateScheduleEntry } from "@/server-actions/schedule/update-schedule-entry"
import { type Instructor, type ScheduleEntryWithInstructors } from "@/lib/db"
import { DAY_NAMES } from "@/data/schedule"

interface DialogData {
  entry: ScheduleEntryWithInstructors | null
  instructors: Instructor[]
  dayIndex: number
}

export const DIALOG_KEY = "ScheduleEntryDialog"

const initialForm = {
  time: "",
  title: "",
  hint: "",
  instructorIds: [] as string[],
}

export const ScheduleEntryDialog = () => {
  const router = useRouter()
  const { closeDialog, dialogData, onSuccess } = useDialogStore()
  const data = dialogData as DialogData | null
  const entry = data?.entry ?? null
  const instructors = data?.instructors ?? []
  const dayIndex = data?.dayIndex ?? entry?.dayIndex ?? 1
  const dayName = DAY_NAMES[dayIndex - 1] ?? ""
  const isEdit = !!entry?.id

  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleInstructorToggle = (instructorId: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      instructorIds: checked
        ? [...prev.instructorIds, instructorId]
        : prev.instructorIds.filter((id) => id !== instructorId),
    }))
  }

  const handleClose = () => {
    setForm(initialForm)
    setError(null)
    closeDialog(DIALOG_KEY)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        dayIndex,
        time: form.time,
        title: form.title,
        hint: form.hint || undefined,
        instructorIds: form.instructorIds,
      }

      const result = isEdit
        ? await updateScheduleEntry(entry.id, payload)
        : await createScheduleEntry(payload)

      if (!result.success) {
        setError(result.error)
        return
      }

      handleClose()
      onSuccess?.()
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (entry) {
      setForm({
        time: entry.time,
        title: entry.title,
        hint: entry.hint ?? "",
        instructorIds: entry.instructors.map((i) => i.id),
      })
    } else {
      setForm(initialForm)
    }
    setError(null)
  }, [entry])

  return (
    <Dialog open onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="max-w-md" onInteractOutside={isEdit ? (e) => e.preventDefault() : undefined}>
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit Class — ${dayName}` : `Add Class — ${dayName}`}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the class details below." : "Fill in the class details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="time">Time *</Label>
            <Input
              id="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="19:00 - 20:00"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Salsa"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="hint">Hint</Label>
            <Input
              id="hint"
              name="hint"
              value={form.hint}
              onChange={handleChange}
              placeholder="Beginners"
            />
          </div>

          <div className="grid gap-2">
            <Label>Instructors</Label>
            <div className="space-y-2 rounded-md border p-3">
              {instructors.length === 0 ? (
                <p className="text-sm text-muted-foreground">No instructors available</p>
              ) : (
                instructors.map((instructor) => (
                  <div key={instructor.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`instructor-${instructor.id}`}
                      checked={form.instructorIds.includes(instructor.id)}
                      onCheckedChange={(checked) =>
                        handleInstructorToggle(instructor.id, checked === true)
                      }
                    />
                    <Image
                      src={instructor.image}
                      alt={instructor.name}
                      width={24}
                      height={24}
                      className="size-6 rounded-full object-cover"
                    />
                    <label
                      htmlFor={`instructor-${instructor.id}`}
                      className="cursor-pointer text-sm"
                    >
                      {instructor.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : isEdit ? <Save className="size-3.5" /> : <Plus className="size-3.5" />}
              {isEdit ? "Save Changes" : "Add Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
