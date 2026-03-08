"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { SubscriptionBadge } from "@/components/ui/subscription-badge"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { copyToClipboard, formatDate } from "@/lib/format"
import { type SubscriptionWithDetails } from "@/server-actions/subscriptions/get-subscriptions"

const packageBadgeStyles: Record<string, string> = {
  "Rayo 8": "border-transparent bg-blue-500/15 text-blue-500",
  "Rayo 16": "border-transparent bg-purple-500/15 text-purple-500",
  "Rayo 24": "border-transparent bg-pink-500/15 text-pink-500",
}

export const columns: ColumnDef<SubscriptionWithDetails>[] = [
  {
    id: "studentName",
    accessorFn: (row) => row.student.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("studentName") as string
      return (
        <button
          className="font-medium cursor-pointer hover:text-primary transition-colors"
          onClick={() => copyToClipboard(name, "Name")}
        >
          {name}
        </button>
      )
    },
    filterFn: (row, _id, value: string) => {
      if (!value) return true
      return row.original.student.id === value
    },
  },
  {
    accessorKey: "packageName",
    header: "Package",
    cell: ({ row }) => {
      const pkg: string = row.getValue("packageName")
      return (
        <Badge className={packageBadgeStyles[pkg] ?? "border-transparent bg-muted text-muted-foreground"}>
          {pkg}
        </Badge>
      )
    },
  },
  {
    accessorKey: "lessonsPerWeek",
    header: "Lessons/wk",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("lessonsPerWeek")}</span>
    ),
  },
  {
    id: "weeklyUsage",
    header: "This Week",
    accessorFn: (row) => row.student.attendances.length,
    cell: ({ row }) => {
      const attended = row.getValue("weeklyUsage") as number
      const limit = row.original.lessonsPerWeek

      let colorClass = "text-emerald-500"
      if (attended > limit) colorClass = "text-red-500"
      else if (attended === limit) colorClass = "text-amber-500"

      return (
        <span className={`font-medium ${colorClass}`}>
          {attended}/{limit}
        </span>
      )
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Started" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.getValue("startDate"))}
      </span>
    ),
    sortingFn: "datetime",
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires" />
    ),
    cell: ({ row }) => (
      <SubscriptionBadge expiresAt={row.getValue("expiresAt")} />
    ),
    sortingFn: "datetime",
  },
  {
    accessorKey: "amountPaid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Paid" />
    ),
    cell: ({ row }) => {
      const amount: number = row.getValue("amountPaid")
      return <span className="font-medium">€{amount.toFixed(2)}</span>
    },
  },
  {
    id: "status",
    header: "Status",
    accessorFn: (row) => {
      if (!row.isActive) return "expired"
      return new Date(row.expiresAt) > new Date() ? "active" : "expired"
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const isActive = status === "active"
      return (
        <Badge
          className={
            isActive
              ? "border-transparent bg-emerald-500/15 text-emerald-500"
              : "border-transparent bg-red-500/15 text-red-500"
          }
        >
          {isActive ? "Active" : "Expired"}
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) =>
      value.includes(row.getValue(id) as string),
  },
]
