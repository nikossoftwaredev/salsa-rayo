"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { copyToClipboard, formatDate } from "@/lib/format"
import { TYPE_LABELS, METHOD_LABELS } from "@/data/payment-constants"
import { MdDeleteOutline } from "react-icons/md"
import { type TransactionWithStudent } from "@/server-actions/payments/get-transactions"

const typeBadgeStyles: Record<string, string> = {
  subscription: "border-transparent bg-blue-500/15 text-blue-500",
  "drop-in": "border-transparent bg-amber-500/15 text-amber-500",
  private: "border-transparent bg-purple-500/15 text-purple-500",
}

export type IncomeRowActions = {
  onDelete: (transaction: TransactionWithStudent) => void
}

const baseColumns: ColumnDef<TransactionWithStudent>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.getValue("createdAt"))}
      </span>
    ),
  },
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
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type: string = row.getValue("type")
      return (
        <Badge className={typeBadgeStyles[type] ?? ""}>
          {TYPE_LABELS[type] ?? type}
        </Badge>
      )
    },
    filterFn: (row, id, value: string[]) =>
      value.includes(row.getValue(id)),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount: number = row.getValue("amount")
      return <span className="font-medium">€{amount.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => {
      const method: string = row.getValue("paymentMethod")
      return (
        <span className="text-muted-foreground">
          {METHOD_LABELS[method] ?? method}
        </span>
      )
    },
    filterFn: (row, id, value: string[]) =>
      value.includes(row.getValue(id)),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground max-w-[200px] truncate block">
        {row.getValue("description") || "-"}
      </span>
    ),
  },
]

// Read-only columns (used in TransactionHistoryDialog)
export const columns = baseColumns

// Columns with delete action (used in IncomeTable)
export const createColumns = ({
  onDelete,
}: IncomeRowActions): ColumnDef<TransactionWithStudent>[] => [
  ...baseColumns,
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(row.original)}
        >
          <MdDeleteOutline size={16} />
        </Button>
      </div>
    ),
  },
]
