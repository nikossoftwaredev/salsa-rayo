"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { useConfirmStore } from "@/lib/stores/confirm-store"
import { deleteInstructor } from "@/server-actions/instructors/delete-instructor"
import { DIALOG_KEY } from "@/components/admin/instructors/InstructorDialog"
import { type Instructor } from "@/lib/db"

type InstructorWithCount = Instructor & {
  _count: { scheduleEntries: number }
}

interface InstructorsGridProps {
  data: InstructorWithCount[]
}

export const InstructorsGrid = ({ data }: InstructorsGridProps) => {
  const router = useRouter()
  const { openDialog } = useDialogStore()
  const { confirm } = useConfirmStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = () => {
    openDialog(DIALOG_KEY)
  }

  const handleEdit = (instructor: InstructorWithCount) => {
    openDialog(DIALOG_KEY, instructor)
  }

  const handleDelete = (instructor: InstructorWithCount) => {
    confirm({
      title: "Delete Instructor",
      description: `Are you sure you want to delete ${instructor.name}?`,
      onConfirm: async () => {
        setDeletingId(instructor.id)
        try {
          const result = await deleteInstructor(instructor.id)
          if (!result.success) {
            alert(result.error)
            return
          }
          router.refresh()
        } finally {
          setDeletingId(null)
        }
      },
    })
  }

  return (
    <div>
      <div className="mb-4">
        <Button onClick={handleAdd}>
          <IoAdd className="!size-5" />
          Add Instructor
        </Button>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          No instructors yet. Add your first instructor to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((instructor) => (
            <div
              key={instructor.id}
              className="flex gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="shrink-0">
                <Image
                  src={instructor.image}
                  alt={instructor.name}
                  width={80}
                  height={80}
                  className="size-20 rounded-full object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="truncate font-semibold text-card-foreground">
                  {instructor.name}
                </h3>
                {instructor.bio && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {instructor.bio}
                  </p>
                )}
                <p className="mt-auto pt-2 text-xs text-muted-foreground">
                  {instructor._count.scheduleEntries}{" "}
                  {instructor._count.scheduleEntries === 1 ? "class" : "classes"}
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(instructor)}
                    >
                      <IoPencil className="!size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(instructor)}
                      disabled={deletingId === instructor.id}
                    >
                      <IoTrash className="!size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
