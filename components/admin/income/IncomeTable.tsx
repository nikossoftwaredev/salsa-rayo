"use client"

import { useCallback, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { NumericInput } from "@/components/ui/numeric-input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/data-table/data-table"
import { createColumns } from "./columns"
import { IncomeToolbar } from "./income-toolbar"
import { deleteTransaction } from "@/server-actions/payments/delete-transaction"
import { issueInvoiceForTransaction } from "@/server-actions/invoices/issue-invoice-for-transaction"
import { retryFailedInvoice } from "@/server-actions/invoices/retry-failed-invoice"
import { type TransactionWithStudent } from "@/server-actions/payments/get-transactions"
import { openPdfInNewTab } from "@/lib/pdf"

interface IncomeTableProps {
  data: TransactionWithStudent[]
}

export const IncomeTable = ({ data }: IncomeTableProps) => {
  const router = useRouter()
  const [deletingTransaction, setDeletingTransaction] = useState<TransactionWithStudent | null>(null)
  const [invoicingTransaction, setInvoicingTransaction] = useState<TransactionWithStudent | null>(null)
  const [invoiceAmount, setInvoiceAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = useCallback((transaction: TransactionWithStudent) => {
    setDeletingTransaction(transaction)
  }, [])

  const handleIssueInvoice = useCallback((transaction: TransactionWithStudent) => {
    setInvoicingTransaction(transaction)
    setInvoiceAmount(transaction.amount.toFixed(2))
  }, [])

  const confirmIssueInvoice = async () => {
    if (!invoicingTransaction) return
    const amount = parseFloat(invoiceAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid amount")
      return
    }

    setIsSubmitting(true)
    const toastId = toast.loading("Issuing invoice & generating PDF")
    const result = await issueInvoiceForTransaction(invoicingTransaction.id, amount)
    if (!result.success) {
      toast.error(result.error, { id: toastId })
      setIsSubmitting(false)
      return
    }

    // Auto-generate and open PDF
    try {
      await openPdfInNewTab(`/api/invoices/${result.invoiceId}/pdf`)
      toast.success("Invoice issued", { id: toastId })
    } catch {
      toast.success("Invoice issued (PDF generation failed)", { id: toastId })
    }

    setInvoicingTransaction(null)
    setIsSubmitting(false)
    router.refresh()
  }

  const handleViewInvoicePdf = useCallback(async (transaction: TransactionWithStudent) => {
    if (!transaction.invoice?.id) return
    const toastId = toast.loading("Generating PDF")
    try {
      await openPdfInNewTab(`/api/invoices/${transaction.invoice.id}/pdf`)
      toast.dismiss(toastId)
    } catch {
      toast.error("Failed to generate PDF", { id: toastId })
    }
  }, [])

  const handleRetryInvoice = useCallback(async (transaction: TransactionWithStudent) => {
    if (!transaction.invoice) return
    const toastId = toast.loading("Retrying invoice")
    const result = await retryFailedInvoice(transaction.invoice.id)
    if (result.success) {
      toast.success("Invoice retried successfully", { id: toastId })
      router.refresh()
    } else {
      toast.error(result.error, { id: toastId })
    }
  }, [router])

  const confirmDelete = async () => {
    if (!deletingTransaction) return
    const result = await deleteTransaction(deletingTransaction.id)
    if (result.success) {
      toast.success("Transaction deleted")
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setDeletingTransaction(null)
  }

  const columns = useMemo(
    () => createColumns({
      onDelete: handleDelete,
      onIssueInvoice: handleIssueInvoice,
      onRetryInvoice: handleRetryInvoice,
      onViewInvoicePdf: handleViewInvoicePdf,
    }),
    [handleDelete, handleIssueInvoice, handleRetryInvoice, handleViewInvoicePdf]
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        toolbar={(table) => <IncomeToolbar table={table} />}
      />

      {/* Issue Invoice Dialog */}
      <Dialog
        open={!!invoicingTransaction}
        onOpenChange={(open) => { if (!open && !isSubmitting) setInvoicingTransaction(null) }}
      >
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Issue Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              {invoicingTransaction?.studentName || invoicingTransaction?.student?.name}
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="invoice-amount">Amount (€)</Label>
              <NumericInput
                id="invoice-amount"
                value={invoiceAmount}
                onChange={(value) => setInvoiceAmount(value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoicingTransaction(null)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={confirmIssueInvoice} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="size-4 animate-spin" /> Issuing</> : "Issue Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingTransaction}
        onOpenChange={(open) => { if (!open) setDeletingTransaction(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the €{deletingTransaction?.amount.toFixed(2)}{" "}
              {deletingTransaction?.studentName || deletingTransaction?.student?.name} transaction.
              {deletingTransaction?.type === "subscription" && deletingTransaction?.subscriptionId && (
                <> This will also cancel their active subscription.</>
              )}
              {" "}This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
