"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { RayoPoints } from "@/components/ui/rayo-points"
import { MdEdit } from "react-icons/md"
import { IoWalletOutline, IoReceiptOutline } from "react-icons/io5"
import { SubscriptionBadge } from "@/components/ui/subscription-badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { copyToClipboard, formatDate } from "@/lib/format"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { type StudentWithSubscriptions } from "./types"

const getActiveSubscription = (student: StudentWithSubscriptions) =>
  student.subscriptions.find((sub) => sub.isActive) ?? student.subscriptions[0]

export const columns: ColumnDef<StudentWithSubscriptions>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name: string = row.getValue("name")
      return (
        <div className="flex items-center gap-1.5">
          <button
            className="font-medium cursor-pointer hover:text-primary transition-colors"
            onClick={() => copyToClipboard(name, "Name")}
          >
            {name}
          </button>
          <RayoPoints points={row.original.rayoPoints} size="sm" />
        </div>
      )
    },
    filterFn: (row, _id, value: string) => {
      if (!value) return true
      return row.original.id === value
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
    id: "joinedAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.getValue("joinedAt"))}
      </span>
    ),
    sortingFn: "datetime",
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
    accessorFn: (row) => getActiveSubscription(row)?.expiresAt ?? null,
    cell: ({ row }) => {
      const expiresAt = row.getValue("subStatus") as Date | null
      return <SubscriptionBadge expiresAt={expiresAt} />
    },
    filterFn: (row, id, value: string[]) => {
      const expiresAt = row.getValue(id) as Date | null
      if (!expiresAt) return value.includes("false")
      const isActive = new Date(expiresAt) > new Date()
      return value.includes(String(isActive))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                useDialogStore.getState().openDialog("TransactionHistoryDialog", row.original)
              }
            >
              <IoReceiptOutline size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Payment History</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                useDialogStore.getState().openDialog("PaymentDialog", row.original)
              }
            >
              <IoWalletOutline size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Payment</TooltipContent>
        </Tooltip>
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
      </div>
    ),
  },
]
