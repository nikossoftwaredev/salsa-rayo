"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { copyToClipboard, formatDate } from "@/lib/format"
import { TYPE_LABELS, METHOD_LABELS } from "@/data/payment-constants"
import { MdDeleteOutline } from "react-icons/md"
import { TbFileInvoice, TbRefresh, TbPrinter } from "react-icons/tb"
import { type TransactionWithStudent } from "@/server-actions/payments/get-transactions"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const typeBadgeStyles: Record<string, string> = {
  subscription: "border-transparent bg-blue-500/15 text-blue-500",
  "drop-in": "border-transparent bg-amber-500/15 text-amber-500",
  private: "border-transparent bg-purple-500/15 text-purple-500",
}

const invoiceBadgeStyles: Record<string, string> = {
  submitted: "border-transparent bg-emerald-500/15 text-emerald-500",
  pending: "border-transparent bg-yellow-500/15 text-yellow-500",
  failed: "border-transparent bg-red-500/15 text-red-500",
}

export type IncomeRowActions = {
  onDelete: (transaction: TransactionWithStudent) => void
  onIssueInvoice: (transaction: TransactionWithStudent) => void
  onRetryInvoice: (transaction: TransactionWithStudent) => void
  onViewInvoicePdf: (transaction: TransactionWithStudent) => void
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
    accessorFn: (row) => row.studentName || row.student?.name || "Deleted",
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
  {
    id: "invoice",
    header: "Invoice",
    cell: ({ row }) => {
      const invoice = row.original.invoice
      if (!invoice) return <span className="text-muted-foreground">-</span>

      return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className={invoiceBadgeStyles[invoice.status] ?? ""}>
                {invoice.status === "submitted" && invoice.mark
                  ? `#${invoice.mark}`
                  : invoice.status}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-1">
                <p>Series: {invoice.series} / {invoice.sequenceNumber}</p>
                <p>Net: €{invoice.netAmount.toFixed(2)} + VAT: €{invoice.vatAmount.toFixed(2)}</p>
                {invoice.mark && <p>MARK: {invoice.mark}</p>}
                {invoice.status === "failed" && invoice.aadeErrors && (
                  <p className="text-red-400">
                    {JSON.parse(invoice.aadeErrors)?.[0]?.message || "Unknown error"}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
      )
    },
  },
]

// Read-only columns (used in TransactionHistoryDialog)
export const columns = baseColumns

// Columns with actions (used in IncomeTable)
export const createColumns = ({
  onDelete,
  onIssueInvoice,
  onRetryInvoice,
  onViewInvoicePdf,
}: IncomeRowActions): ColumnDef<TransactionWithStudent>[] => [
  ...baseColumns,
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original.invoice
      return (
        <div className="flex items-center justify-end gap-1">
          {/* View submitted invoice PDF */}
          {invoice?.status === "submitted" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => onViewInvoicePdf(row.original)}
                >
                  <TbPrinter size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print Invoice</TooltipContent>
            </Tooltip>
          )}

          {/* Issue invoice - only if no invoice exists */}
          {!invoice && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-primary hover:text-primary"
                  onClick={() => onIssueInvoice(row.original)}
                >
                  <TbFileInvoice size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Issue Invoice</TooltipContent>
            </Tooltip>
          )}

          {/* Retry failed invoice */}
          {invoice?.status === "failed" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-yellow-500 hover:text-yellow-500"
                  onClick={() => onRetryInvoice(row.original)}
                >
                  <TbRefresh size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Retry Invoice</TooltipContent>
            </Tooltip>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(row.original)}
          >
            <MdDeleteOutline size={16} />
          </Button>
        </div>
      )
    },
  },
]
