"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
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
import { RayoPoints } from "@/components/ui/rayo-points"
import { SubscriptionBadge } from "@/components/ui/subscription-badge"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { copyToClipboard, formatDate } from "@/lib/format"
import { removeAttendance } from "@/server-actions/attendance/remove-attendance"
import { type AttendanceRecord } from "@/server-actions/attendance/get-all-attendances"

const classTitle = (dc: AttendanceRecord["danceClass"]) =>
  dc.title ?? dc.scheduleEntry?.title ?? "Deleted class"

const classTime = (dc: AttendanceRecord["danceClass"]) =>
  dc.time ?? dc.scheduleEntry?.time ?? ""

const DeleteAction = ({ row, onSuccess }: { row: AttendanceRecord; onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const result = await removeAttendance(row.id)
    setLoading(false)
    if (result.success) {
      toast.success("Attendance removed")
      onSuccess()
    } else {
      toast.error(result.error ?? "Failed to remove attendance")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="size-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove attendance?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove {row.student.name}&apos;s attendance and deduct 30 rayo points.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? <><Loader2 className="size-4 animate-spin" /> Removing</> : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const columns: ColumnDef<AttendanceRecord>[] = [
  {
    id: "studentName",
    accessorFn: (row) => row.student.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student" />
    ),
    cell: ({ row }) => {
      const name = row.original.student.name
      const email = row.original.student.email
      return (
        <div>
          <button
            className="font-medium cursor-pointer hover:text-primary transition-colors"
            onClick={() => copyToClipboard(name, "Name")}
          >
            {name}
          </button>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      )
    },
    filterFn: (row, _id, value: string) => {
      if (!value) return true
      const studentId = row.original.student.id
      return studentId === value
    },
  },
  {
    id: "class",
    accessorFn: (row) => classTitle(row.danceClass),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class" />
    ),
    cell: ({ row }) => {
      const title = classTitle(row.original.danceClass)
      const time = classTime(row.original.danceClass)
      return (
        <div>
          <span className="font-medium">{title}</span>
          {time && <p className="text-xs text-muted-foreground">{time}</p>}
        </div>
      )
    },
    filterFn: (row, _id, value: string[]) => {
      if (!value?.length) return true
      return value.includes(classTitle(row.original.danceClass))
    },
  },
  {
    id: "classDate",
    accessorFn: (row) => new Date(row.danceClass.date),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Class Date" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.danceClass.date)}
      </span>
    ),
    sortingFn: "datetime",
  },
  {
    id: "subscription",
    header: "Subscription",
    cell: ({ row }) => (
      <SubscriptionBadge
        expiresAt={row.original.student.subscriptions[0]?.expiresAt ?? null}
      />
    ),
  },
  {
    id: "rayoPoints",
    accessorFn: (row) => row.student.rayoPoints,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Points" />
    ),
    cell: ({ row }) => (
      <RayoPoints points={row.original.student.rayoPoints} size="sm" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recorded" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.getValue("createdAt"))}
      </span>
    ),
    sortingFn: "datetime",
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <DeleteAction
        row={row.original}
        onSuccess={() => (table.options.meta as { refresh?: () => void })?.refresh?.()}
      />
    ),
  },
]
