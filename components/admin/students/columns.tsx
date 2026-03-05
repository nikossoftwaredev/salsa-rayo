"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { IoEllipsisHorizontal, IoFlash } from "react-icons/io5"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { type StudentWithSubscriptions } from "./types"

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
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("phone") || "—"}
      </span>
    ),
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
      <div className="flex items-center gap-1">
        <IoFlash size={14} className="text-yellow-500" />
        <span className="font-medium">{row.getValue("rayoPoints")}</span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <IoEllipsisHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student.email)}
            >
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit student</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
