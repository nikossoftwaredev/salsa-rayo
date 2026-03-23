"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { NumericInput } from "@/components/ui/numeric-input"
import { Plus, Loader2 } from "lucide-react"
import { FaStripe } from "react-icons/fa6"
import { toast } from "sonner"
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
import { DatePicker } from "@/components/ui/date-picker"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { createPayment } from "@/server-actions/payments/create-payment"
import { ADMIN_PACKAGES } from "@/data/packages"
import {
  PAYMENT_TYPES,
  PAYMENT_METHODS,
  METHOD_ICON_MAP,
  type PaymentMethodIcon,
  type PaymentType,
  type PaymentMethod,
} from "@/data/payment-constants"
import { type StudentWithSubscriptions } from "./types"

const DIALOG_KEY = "PaymentDialog"

const PAYMENT_METHOD_ICONS: Record<string, PaymentMethodIcon> = { ...METHOD_ICON_MAP, stripe: FaStripe }

const getInitialForm = () => ({
  type: "subscription" as PaymentType,
  paymentMethod: "cash" as PaymentMethod,
  packageIndex: 0,
  amount: String(ADMIN_PACKAGES[0].price),
  description: "",
  startDate: new Date() as Date | undefined,
})

export const PaymentDialog = () => {
  const router = useRouter()
  const { closeDialog, dialogData } = useDialogStore()
  const student = dialogData as StudentWithSubscriptions | null

  const [form, setForm] = useState(getInitialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const amountValue = parseFloat(form.amount) || 0

  if (!student) return null

  const handleClose = () => {
    setForm(getInitialForm())
    setError(null)
    closeDialog(DIALOG_KEY)
  }

  const handleTypeChange = (type: PaymentType) => {
    if (type === "subscription") {
      const pkg = ADMIN_PACKAGES[0]
      setForm((prev) => ({ ...prev, type, packageIndex: 0, amount: String(pkg.price), description: "" }))
    } else {
      setForm((prev) => ({ ...prev, type, amount: "", description: "" }))
    }
  }

  const handlePackageChange = (value: string) => {
    const index = parseInt(value)
    const pkg = ADMIN_PACKAGES[index]
    setForm((prev) => ({ ...prev, packageIndex: index, amount: String(pkg.price) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const pkg = form.type === "subscription" ? ADMIN_PACKAGES[form.packageIndex] : null

      const result = await createPayment({
        studentId: student.id,
        type: form.type,
        paymentMethod: form.paymentMethod,
        amount: amountValue,
        description: form.description || undefined,
        ...(pkg && {
          packageName: pkg.title,
          lessonsPerWeek: pkg.lessonsPerWeek,
          durationDays: pkg.durationDays,
          startDate: form.startDate?.toISOString().split("T")[0],
        }),
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      toast.success("Payment recorded", {
        description: `€${form.amount} ${form.type} for ${student.name}`,
        action: {
          label: "View Payments",
          onClick: () => router.push("/admin/income"),
        },
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
    <Dialog open onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            Recording payment for <span className="font-medium text-foreground">{student.name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => handleTypeChange(v as PaymentType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {form.type === "subscription" && (
            <div className="grid gap-2">
              <Label>Package</Label>
              <Select value={String(form.packageIndex)} onValueChange={handlePackageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_PACKAGES.map((pkg, i) => (
                    <SelectItem key={pkg.title} value={String(i)}>
                      {pkg.title} — €{pkg.price} ({pkg.lessonsPerWeek}x/week)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (€)</Label>
            <NumericInput
              id="amount"
              value={form.amount}
              onChange={(value) => setForm((prev) => ({ ...prev, amount: value }))}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Payment Method</Label>
            <Select value={form.paymentMethod} onValueChange={(v) => setForm((prev) => ({ ...prev, paymentMethod: v as PaymentMethod }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => {
                  const Icon = PAYMENT_METHOD_ICONS[m.value]
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

          {form.type === "subscription" && (
            <div className="grid gap-2">
              <Label>Subscription Start Date</Label>
              <DatePicker
                value={form.startDate}
                onChange={(date) => setForm((prev) => ({ ...prev, startDate: date }))}
                placeholder="Select start date"
              />
            </div>
          )}

          {form.type !== "subscription" && (
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional notes..."
                rows={2}
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || amountValue <= 0}>
              {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              {`Record €${form.amount}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
