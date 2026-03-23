"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { formatDate } from "@/lib/format"
import { METHOD_LABELS } from "@/data/payment-constants"
import { Pencil, Trash2 } from "lucide-react"
import { type ExpenseWithCategory } from "@/server-actions/expenses/get-expenses"

export type ExpenseRowActions = {
  onEdit: (expense: ExpenseWithCategory) => void
  onDelete: (expense: ExpenseWithCategory) => void
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ExpenseRowActions): ColumnDef<ExpenseWithCategory>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.getValue("date"))}
      </span>
    ),
  },
  {
    id: "categoryName",
    accessorFn: (row) => row.category.name,
    header: "Category",
    cell: ({ row }) => (
      <Badge className="border-transparent bg-rose-500/15 text-rose-500">
        {row.getValue("categoryName")}
      </Badge>
    ),
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
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    ),
  },
]
