"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IoCashOutline, IoCardOutline, IoWalletOutline, IoSaveOutline, IoAddOutline } from "react-icons/io5"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "sonner"
import { DatePicker } from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAYMENT_METHODS, type PaymentMethod } from "@/data/payment-constants"
import { type ExpenseCategory } from "@/lib/db"
import { type ExpenseWithCategory } from "@/server-actions/expenses/get-expenses"
import { createExpense } from "@/server-actions/expenses/create-expense"
import { updateExpense } from "@/server-actions/expenses/update-expense"

const METHOD_ICON_MAP: Record<string, React.ComponentType<{ size: number }>> = {
  cash: IoCashOutline,
  card: IoCardOutline,
  "bank-transfer": IoWalletOutline,
}

interface ExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: ExpenseCategory[]
  expense?: ExpenseWithCategory | null
}

export const ExpenseDialog = ({
  open,
  onOpenChange,
  categories,
  expense,
}: ExpenseDialogProps) => {
  const router = useRouter()
  const isEditing = !!expense

  const [form, setForm] = useState(() => ({
    amount: expense?.amount ?? 0,
    date: expense ? new Date(expense.date) : new Date(),
    categoryId: expense?.categoryId ?? (categories[0]?.id ?? ""),
    paymentMethod: (expense?.paymentMethod ?? "cash") as PaymentMethod,
    description: expense?.description ?? "",
  }))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setError(null)
    onOpenChange(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const dateStr = form.date.toISOString()
      const result = isEditing
        ? await updateExpense({
            id: expense.id,
            amount: form.amount,
            date: dateStr,
            categoryId: form.categoryId,
            paymentMethod: form.paymentMethod,
            description: form.description || undefined,
          })
        : await createExpense({
            amount: form.amount,
            date: dateStr,
            categoryId: form.categoryId,
            paymentMethod: form.paymentMethod,
            description: form.description || undefined,
          })

      if (!result.success) {
        setError(result.error)
        return
      }

      const categoryName = categories.find((c) => c.id === form.categoryId)?.name
      toast.success(isEditing ? "Expense updated" : "Expense recorded", {
        description: `€${form.amount} - ${categoryName}`,
      })
      handleClose()
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Expense" : "Add Expense"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update expense details." : "Record a new expense."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="expense-amount">Amount (€)</Label>
            <Input
              id="expense-amount"
              type="number"
              min={0}
              step={0.01}
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  amount: Math.max(0, parseFloat(e.target.value) || 0),
                }))
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Date</Label>
            <DatePicker
              value={form.date}
              onChange={(date) =>
                setForm((prev) => ({ ...prev, date: date ?? prev.date }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              value={form.categoryId}
              onValueChange={(v) =>
                setForm((prev) => ({ ...prev, categoryId: v }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Payment Method</Label>
            <Select
              value={form.paymentMethod}
              onValueChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  paymentMethod: v as PaymentMethod,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => {
                  const Icon = METHOD_ICON_MAP[m.value]
                  return (
                    <SelectItem key={m.value} value={m.value}>
                      <span className="flex items-center gap-2">
                        {Icon && <Icon size={14} />}
                        {m.label}
                      </span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expense-description">Description</Label>
            <Textarea
              id="expense-description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Optional notes..."
              rows={2}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || form.amount <= 0 || !form.categoryId}>
              {loading ? <ImSpinner8 size={14} className="animate-spin" /> : isEditing ? <IoSaveOutline size={14} /> : <IoAddOutline size={14} />}
              {isEditing ? "Update" : `Record €${form.amount}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
