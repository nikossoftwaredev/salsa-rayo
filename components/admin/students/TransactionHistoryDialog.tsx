"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "@/components/admin/income/columns"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { getTransactions, type TransactionWithStudent } from "@/server-actions/payments/get-transactions"
import { Skeleton } from "@/components/ui/skeleton"
import { type StudentWithSubscriptions } from "./types"

const DIALOG_KEY = "TransactionHistoryDialog"

export const TransactionHistoryDialog = () => {
  const { closeDialog, dialogData } = useDialogStore()
  const student = dialogData as StudentWithSubscriptions | null

  const [transactions, setTransactions] = useState<TransactionWithStudent[] | null>(null)
  const isMountedRef = useRef(true)

  const handleClose = () => {
    setTransactions(null)
    closeDialog(DIALOG_KEY)
  }

  useEffect(() => {
    isMountedRef.current = true

    if (!student?.id) return

    const fetchData = async () => {
      const result = await getTransactions(student.id)
      if (isMountedRef.current) {
        setTransactions(result.success ? result.data ?? [] : [])
      }
    }

    fetchData()

    return () => {
      isMountedRef.current = false
    }
  }, [student?.id])

  if (!student) return null

  return (
    <Dialog open onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment History — {student.name}</DialogTitle>
        </DialogHeader>

        {transactions === null ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No payments recorded yet.
          </p>
        ) : (
          <DataTable columns={columns} data={transactions} />
        )}
      </DialogContent>
    </Dialog>
  )
}
