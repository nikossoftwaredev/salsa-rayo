"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  IoCashOutline,
  IoCardOutline,
  IoWalletOutline,
  IoAddOutline,
} from "react-icons/io5"
import { FaStripe } from "react-icons/fa6"
import { ImSpinner8 } from "react-icons/im"
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
import { useDialogStore } from "@/lib/stores/dialog-store"
import { createPayment } from "@/server-actions/payments/create-payment"
import { ADMIN_PACKAGES } from "@/data/packages"
import {
  PAYMENT_TYPES,
  PAYMENT_METHODS,
  type PaymentType,
  type PaymentMethod,
} from "@/data/payment-constants"
import { type StudentWithSubscriptions } from "./types"

const DIALOG_KEY = "PaymentDialog"

const METHOD_ICON_MAP: Record<string, React.ComponentType<{ size: number }>> = {
  cash: IoCashOutline,
  card: IoCardOutline,
  "bank-transfer": IoWalletOutline,
  stripe: FaStripe,
}

const getInitialForm = () => ({
  type: "subscription" as PaymentType,
  paymentMethod: "cash" as PaymentMethod,
  packageIndex: 0,
  amount: ADMIN_PACKAGES[0].price,
  description: "",
})

export const PaymentDialog = () => {
  const router = useRouter()
  const { closeDialog, dialogData } = useDialogStore()
  const student = dialogData as StudentWithSubscriptions | null

  const [form, setForm] = useState(getInitialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!student) return null

  const handleClose = () => {
    setForm(getInitialForm())
    setError(null)
    closeDialog(DIALOG_KEY)
  }

  const handleTypeChange = (type: PaymentType) => {
    if (type === "subscription") {
      const pkg = ADMIN_PACKAGES[0]
      setForm((prev) => ({ ...prev, type, packageIndex: 0, amount: pkg.price, description: "" }))
    } else {
      setForm((prev) => ({ ...prev, type, amount: 0, description: "" }))
    }
  }

  const handlePackageChange = (value: string) => {
    const index = parseInt(value)
    const pkg = ADMIN_PACKAGES[index]
    setForm((prev) => ({ ...prev, packageIndex: index, amount: pkg.price }))
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
        amount: form.amount,
        description: form.description || undefined,
        ...(pkg && {
          packageName: pkg.title,
          lessonsPerWeek: pkg.lessonsPerWeek,
          durationDays: pkg.durationDays,
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
            <Input
              id="amount"
              type="number"
              min={0}
              step={0.01}
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: Math.max(0, parseFloat(e.target.value) || 0) }))}
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
            <Button type="submit" disabled={loading || form.amount <= 0}>
              {loading ? <ImSpinner8 size={14} className="animate-spin" /> : <IoAddOutline size={14} />}
              {`Record €${form.amount}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
