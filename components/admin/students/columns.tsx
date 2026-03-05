"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { RayoPoints } from "@/components/ui/rayo-points"
import { MdEdit } from "react-icons/md"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { type StudentWithSubscriptions } from "./types"

const copyToClipboard = (value: string, label: string) => {
  navigator.clipboard.writeText(value)
  toast.success(`${label} copied`, { description: value })
}

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const getActiveSubscription = (student: StudentWithSubscriptions) =>
  student.subscriptions.find((sub) => sub.isActive) ?? student.subscriptions[0]

const getSubStatus = (student: StudentWithSubscriptions) => {
  const sub = getActiveSubscription(student)
  if (!sub) return { label: "No Sub", active: false }
  if (!sub.isActive || new Date(sub.expiresAt) < new Date())
    return { label: "Expired", active: false }
  return { label: "Active", active: true }
}

export const columns: ColumnDef<StudentWithSubscriptions>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name: string = row.getValue("name")
      return (
        <button
          className="font-medium cursor-pointer hover:text-primary transition-colors"
          onClick={() => copyToClipboard(name, "Name")}
        >
          {name}
        </button>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email: string = row.getValue("email")
      return (
        <button
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={() => copyToClipboard(email, "Email")}
        >
          {email}
        </button>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone: string = row.getValue("phone")
      if (!phone) return <span className="text-muted-foreground">—</span>
      return (
        <button
          className="text-muted-foreground cursor-pointer hover:text-primary transition-colors"
          onClick={() => copyToClipboard(phone, "Phone")}
        >
          {phone}
        </button>
      )
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <span className="text-muted-foreground max-w-[200px] truncate block">
        {row.getValue("address") || "—"}
      </span>
    ),
  },
  {
    id: "subStartDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Started" />
    ),
    accessorFn: (row) => getActiveSubscription(row)?.startDate,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.getValue("subStartDate"))}
      </span>
    ),
  },
  {
    id: "subEndDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Ending" />
    ),
    accessorFn: (row) => getActiveSubscription(row)?.expiresAt,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.getValue("subEndDate"))}
      </span>
    ),
  },
  {
    id: "subStatus",
    header: "Sub Status",
    accessorFn: (row) => getSubStatus(row).active,
    cell: ({ row }) => {
      const status = getSubStatus(row.original)
      return (
        <Badge
          className={
            status.active
              ? "border-transparent bg-emerald-500/15 text-emerald-500"
              : "border-transparent bg-red-500/15 text-red-500"
          }
        >
          {status.label}
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) =>
      value.includes(String(row.getValue(id))),
  },
  {
    accessorKey: "rayoPoints",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rayo Points" />
    ),
    cell: ({ row }) => (
      <RayoPoints points={row.getValue("rayoPoints")} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              useDialogStore.getState().openDialog("StudentDialog", row.original)
            }
          >
            <MdEdit size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>
    ),
  },
]
