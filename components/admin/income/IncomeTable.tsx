"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
import { DataTable } from "@/components/data-table/data-table"
import { createColumns } from "./columns"
import { IncomeToolbar } from "./income-toolbar"
import { deleteTransaction } from "@/server-actions/payments/delete-transaction"
import { type TransactionWithStudent } from "@/server-actions/payments/get-transactions"

interface IncomeTableProps {
  data: TransactionWithStudent[]
}

export const IncomeTable = ({ data }: IncomeTableProps) => {
  const router = useRouter()
  const [deletingTransaction, setDeletingTransaction] = useState<TransactionWithStudent | null>(null)

  const handleDelete = useCallback((transaction: TransactionWithStudent) => {
    setDeletingTransaction(transaction)
  }, [])

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

  const columns = useMemo(() => createColumns({ onDelete: handleDelete }), [handleDelete])

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        toolbar={(table) => <IncomeToolbar table={table} />}
      />

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
