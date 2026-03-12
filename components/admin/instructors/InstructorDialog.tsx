"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { IoSaveOutline, IoAddOutline } from "react-icons/io5"
import { ImSpinner8 } from "react-icons/im"
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
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { createInstructor } from "@/server-actions/instructors/create-instructor"
import { updateInstructor } from "@/server-actions/instructors/update-instructor"
import { type Instructor } from "@/lib/db"

export const DIALOG_KEY = "InstructorDialog"

const initialForm = {
  name: "",
  image: "",
  bio: "",
}

export const InstructorDialog = () => {
  const router = useRouter()
  const { closeDialog, dialogData, onSuccess } = useDialogStore()
  const instructor = dialogData as Instructor | null
  const isEdit = !!instructor?.id

  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
        name: form.name,
        image: form.image,
        bio: form.bio || undefined,
      }

      const result = isEdit
        ? await updateInstructor(instructor.id, payload)
        : await createInstructor(payload)

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
    if (instructor) {
      setForm({
        name: instructor.name,
        image: instructor.image,
        bio: instructor.bio ?? "",
      })
    } else {
      setForm(initialForm)
    }
    setError(null)
  }, [instructor])

  return (
    <Dialog open onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="max-w-md" onInteractOutside={isEdit ? (e) => e.preventDefault() : undefined}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Instructor" : "Add New Instructor"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the instructor details below." : "Fill in the instructor details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Instructor name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Image *</Label>
            <ImageUpload
              value={form.image}
              onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
              folder="instructors"
              size={120}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="A short bio about the instructor..."
              rows={3}
            />
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
              {loading ? <ImSpinner8 size={14} className="animate-spin" /> : isEdit ? <IoSaveOutline size={14} /> : <IoAddOutline size={14} />}
              {isEdit ? "Save Changes" : "Add Instructor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
