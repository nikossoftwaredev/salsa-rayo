"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  IoPersonOutline,
  IoMailOutline,
  IoLocationOutline,
  IoFlash,
  IoTrash,

  IoSaveOutline,
  IoAddOutline,
} from "react-icons/io5"
import { ImSpinner8 } from "react-icons/im"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { createStudent } from "@/server-actions/students/create-student"
import { updateStudent } from "@/server-actions/students/update-student"
import { deleteStudent } from "@/server-actions/students/delete-student"
import { updateSubscriptionDates } from "@/server-actions/subscriptions/update-subscription-dates"
import { formatDate } from "@/lib/format"
import { DatePicker } from "@/components/ui/date-picker"
import { type StudentWithSubscriptions } from "./types"

const DIALOG_KEY = "StudentDialog"

const toLocalDateString = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const getInitialForm = () => ({
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  dancingYears: "",
  isActive: true,
  rayoPoints: "30",
  joinedDate: toLocalDateString(new Date()),
  subscriptionStartDate: null as string | null,
})

export const StudentDialog = () => {
  const router = useRouter()
  const { closeDialog, dialogData, onSuccess } = useDialogStore()
  const student = dialogData as StudentWithSubscriptions | null
  const isEdit = !!student?.id
  const activeSubscription = student?.subscriptions?.find((s) => s.isActive) ?? null

  const [form, setForm] = useState(getInitialForm())
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleClose = () => {
    setForm(getInitialForm())
    setError(null)
    closeDialog(DIALOG_KEY)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const editedJoinedDate = isEdit &&
        form.joinedDate !== toLocalDateString(new Date(student.createdAt))

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        address: form.address || undefined,
        notes: form.notes || undefined,
        dancingYears: form.dancingYears ? parseInt(form.dancingYears) : null,
        ...(editedJoinedDate && { createdAt: new Date(form.joinedDate) }),
        ...(isEdit && { isActive: form.isActive, rayoPoints: Math.max(0, parseInt(form.rayoPoints) || 0) }),
      }

      const result = isEdit
        ? await updateStudent(student.id, payload)
        : await createStudent(payload)

      if (!result.success) {
        setError(result.error)
        return
      }

      if (isEdit && activeSubscription && form.subscriptionStartDate) {
        const originalStart = toLocalDateString(new Date(activeSubscription.startDate))
        if (form.subscriptionStartDate !== originalStart) {
          const subResult = await updateSubscriptionDates(
            activeSubscription.id,
            new Date(form.subscriptionStartDate)
          )
          if (!subResult.success) {
            setError(subResult.error)
            return
          }
        }
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

  const handleDelete = async () => {
    if (!student?.id) return
    setDeleting(true)
    setError(null)
    try {
      const result = await deleteStudent(student.id)
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
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name,
        email: student.email,
        phone: student.phone ?? "",
        address: student.address ?? "",
        notes: student.notes ?? "",
        dancingYears: student.dancingYears?.toString() ?? "",
        isActive: student.isActive,
        rayoPoints: student.rayoPoints.toString(),
        joinedDate: toLocalDateString(new Date(student.createdAt)),
        subscriptionStartDate: activeSubscription ? toLocalDateString(new Date(activeSubscription.startDate)) : null,
      })
    } else {
      setForm(getInitialForm())
    }
    setError(null)
  }, [student, activeSubscription])

  return (
    <Dialog open onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="max-w-md" onInteractOutside={isEdit ? (e) => e.preventDefault() : undefined}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Student" : "Add New Student"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the student details below." : "Fill in the student details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <div className="relative">
              <IoPersonOutline size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <IoMailOutline size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@example.com"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <PhoneInput
              id="phone"
              name="phone"
              value={form.phone}
              onChange={(val) => setForm((prev) => ({ ...prev, phone: val }))}
              placeholder="6912345678"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <IoLocationOutline size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street address"
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dancingYears">Dancing Years</Label>
            <Input
              id="dancingYears"
              name="dancingYears"
              type="number"
              min={0}
              max={50}
              value={form.dancingYears}
              onChange={handleChange}
              placeholder="Years of salsa experience"
            />
          </div>

          <div className="grid gap-2">
            <Label>Joined Date</Label>
            <DatePicker
              value={new Date(form.joinedDate)}
              onChange={(date) =>
                setForm((prev) => ({
                  ...prev,
                  joinedDate: date ? toLocalDateString(date) : prev.joinedDate,
                }))
              }
            />
          </div>

          {isEdit && activeSubscription && (
            <div className="grid gap-2">
              <Label>Subscription Start Date</Label>
              <DatePicker
                value={form.subscriptionStartDate ? new Date(form.subscriptionStartDate) : undefined}
                onChange={(date) =>
                  setForm((prev) => ({
                    ...prev,
                    subscriptionStartDate: date ? toLocalDateString(date) : prev.subscriptionStartDate,
                  }))
                }
              />
              {form.subscriptionStartDate && activeSubscription && (() => {
                const durationMs = new Date(activeSubscription.expiresAt).getTime() - new Date(activeSubscription.startDate).getTime()
                const expiryDate = new Date(new Date(form.subscriptionStartDate).getTime() + durationMs)
                return (
                  <p className="text-xs text-muted-foreground">
                    Expires: {formatDate(expiryDate)}
                  </p>
                )
              })()}
            </div>
          )}

          {isEdit && (
            <div className="grid gap-2">
              <Label htmlFor="rayoPoints">Rayo Points</Label>
              <div className="relative">
                <IoFlash size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-yellow-400" />
                <Input
                  id="rayoPoints"
                  name="rayoPoints"
                  type="number"
                  min={0}
                  value={form.rayoPoints}
                  onChange={(e) => setForm((prev) => ({ ...prev, rayoPoints: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>
          )}

          {isEdit && (
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <Label htmlFor="isActive" className="text-sm font-medium">Active Student</Label>
                <p className="text-xs text-muted-foreground">Inactive students are hidden from attendance</p>
              </div>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter className="flex-row justify-between sm:justify-between">
            {isEdit ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={deleting}>
                    {deleting ? <ImSpinner8 size={14} className="animate-spin" /> : <IoTrash size={14} />}
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete student?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {student?.name} and all their data. Payment records will be preserved.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <ImSpinner8 size={14} className="animate-spin" /> : isEdit ? <IoSaveOutline size={14} /> : <IoAddOutline size={14} />}
                {isEdit ? "Save Changes" : "Add Student"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
