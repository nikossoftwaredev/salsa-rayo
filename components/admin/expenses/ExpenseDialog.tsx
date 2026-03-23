"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { NumericInput } from "@/components/ui/numeric-input"
import { Save, Plus, Loader2 } from "lucide-react"
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

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAYMENT_METHODS, METHOD_ICON_MAP, type PaymentMethod } from "@/data/payment-constants"
import { type ExpenseCategory } from "@/lib/db"
import { type ExpenseWithCategory } from "@/server-actions/expenses/get-expenses"
import { createExpense } from "@/server-actions/expenses/create-expense"
import { updateExpense } from "@/server-actions/expenses/update-expense"

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
    amount: expense?.amount != null ? String(expense.amount) : "",
    date: expense ? new Date(expense.date) : new Date(),
    categoryId: expense?.categoryId ?? (categories[0]?.id ?? ""),
    paymentMethod: (expense?.paymentMethod ?? "cash") as PaymentMethod,
    description: expense?.description ?? "",
  }))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const amountValue = parseFloat(form.amount) || 0

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
            amount: amountValue,
            date: dateStr,
            categoryId: form.categoryId,
            paymentMethod: form.paymentMethod,
            description: form.description || undefined,
          })
        : await createExpense({
            amount: amountValue,
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
            <NumericInput
              id="expense-amount"
              value={form.amount}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  amount: value,
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
                        {Icon && <Icon className="size-3.5" />}
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
            <Button type="submit" disabled={loading || amountValue <= 0 || !form.categoryId}>
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : isEditing ? <Save className="size-3.5" /> : <Plus className="size-3.5" />}
              {isEditing ? "Update" : `Record €${form.amount}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
