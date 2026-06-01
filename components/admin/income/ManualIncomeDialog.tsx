"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { NumericInput } from "@/components/ui/numeric-input"
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
import {
  PAYMENT_TYPES,
  PAYMENT_METHODS,
  METHOD_ICON_MAP,
  type PaymentType,
  type PaymentMethod,
} from "@/data/payment-constants"
import { createManualIncome } from "@/server-actions/payments/create-manual-income"

const MANUAL_TYPES = PAYMENT_TYPES.filter((t) => t.value !== "subscription")

interface ManualIncomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ManualIncomeDialog = ({ open, onOpenChange }: ManualIncomeDialogProps) => {
  const router = useRouter()
  const [form, setForm] = useState({
    amount: "",
    date: new Date(),
    type: "other" as PaymentType,
    paymentMethod: "cash" as PaymentMethod,
    customerName: "",
    description: "",
  })
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
      const result = await createManualIncome({
        amount: amountValue,
        date: form.date.toISOString(),
        type: form.type,
        paymentMethod: form.paymentMethod,
        description: form.description || undefined,
        customerName: form.customerName || undefined,
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      toast.success("Income recorded", {
        description: `€${form.amount} - ${form.type}`,
      })
      setForm({
        amount: "",
        date: new Date(),
        type: "other",
        paymentMethod: "cash",
        customerName: "",
        description: "",
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
          <DialogTitle>Add Manual Income</DialogTitle>
          <DialogDescription>
            Record income not tied to a student (party, choreo, etc.).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="income-amount">Amount (€)</Label>
            <NumericInput
              id="income-amount"
              value={form.amount}
              onChange={(value) => setForm((prev) => ({ ...prev, amount: value }))}
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
              value={form.type}
              onValueChange={(v) =>
                setForm((prev) => ({ ...prev, type: v as PaymentType }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MANUAL_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
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
                setForm((prev) => ({ ...prev, paymentMethod: v as PaymentMethod }))
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
            <Label htmlFor="income-customer">Customer Name (optional)</Label>
            <Input
              id="income-customer"
              value={form.customerName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, customerName: e.target.value }))
              }
              placeholder="e.g. Walk-in customer"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="income-description">Description</Label>
            <Textarea
              id="income-description"
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
            <Button type="submit" disabled={loading || amountValue <= 0}>
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              {`Record €${form.amount || "0"}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
