"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
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
import { DatePicker } from "@/components/ui/date-picker"
import { useDialogStore } from "@/lib/stores/dialog-store"
import { createPayment } from "@/server-actions/payments/create-payment"
import { findPackageByName, useStripePackages } from "@/lib/stripe/packages-context"
import { DEFAULT_LESSONS_PER_WEEK, DEFAULT_PERIOD_DAYS } from "@/lib/stripe/constants"
import { type StripePackage } from "@/lib/stripe/types"
import {
  PAYMENT_TYPES,
  PAYMENT_METHODS,
  METHOD_ICON_MAP,
  type PaymentMethodIcon,
  type PaymentType,
  type PaymentMethod,
} from "@/data/payment-constants"
import { ClassPicker } from "../subscriptions/ClassPicker"
import { type StudentWithSubscriptions } from "./types"

const DIALOG_KEY = "PaymentDialog"

/** Package select value for a one-off price that is not a Stripe product. */
const CUSTOM_PACKAGE = "custom"
const CUSTOM_PACKAGE_NAME = "Custom"

const PAYMENT_METHOD_ICONS: Record<string, PaymentMethodIcon> = { ...METHOD_ICON_MAP, stripe: FaStripe }

const getInitialForm = (student: StudentWithSubscriptions | null, packages: StripePackage[]) => {
  const currentSub = student?.subscriptions[0]
  const currentPackage = currentSub ? findPackageByName(packages, currentSub.packageName) : undefined
  // A current subscription that matches no Stripe product was a custom one - start from it
  const isCustom = currentSub ? !currentPackage : packages.length === 0

  return {
    type: "subscription" as PaymentType,
    paymentMethod: "cash" as PaymentMethod,
    packageId: isCustom ? CUSTOM_PACKAGE : (currentPackage ?? packages[0]).id,
    // Left empty for Stripe packages: an empty amount means "the package price"
    amount: isCustom && currentSub ? String(currentSub.amountPaid) : "",
    customName: isCustom && currentSub ? currentSub.packageName : CUSTOM_PACKAGE_NAME,
    customLessonsPerWeek: String(isCustom && currentSub ? currentSub.lessonsPerWeek : DEFAULT_LESSONS_PER_WEEK),
    customDurationDays: String(DEFAULT_PERIOD_DAYS),
    scheduleEntryIds: currentSub?.scheduleEntries.map((e) => e.id) ?? [],
    description: "",
    startDate: new Date() as Date | undefined,
  }
}

export const PaymentDialog = () => {
  const router = useRouter()
  const { closeDialog, dialogData } = useDialogStore()
  const student = dialogData as StudentWithSubscriptions | null
  const packages = useStripePackages()

  const [form, setForm] = useState(() => getInitialForm(student, packages))
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isSubscription = form.type === "subscription"
  const isCustom = isSubscription && form.packageId === CUSTOM_PACKAGE
  const stripePackage = isSubscription && !isCustom
    ? packages.find((p) => p.id === form.packageId)
    : undefined

  const subscriptionPackage = isCustom
    ? {
        name: form.customName.trim() || CUSTOM_PACKAGE_NAME,
        lessonsPerWeek: parseInt(form.customLessonsPerWeek) || 0,
        durationDays: parseInt(form.customDurationDays) || 0,
      }
    : stripePackage

  // A typed amount always wins (special prices); an empty field falls back to the package price
  const typedAmount = parseFloat(form.amount) || 0
  const amountValue = typedAmount || stripePackage?.priceAmount || 0
  const isSpecialPrice = !!stripePackage && typedAmount > 0 && typedAmount !== stripePackage.priceAmount

  const handleClassesChange = useCallback(
    (scheduleEntryIds: string[]) => setForm((prev) => ({ ...prev, scheduleEntryIds })),
    []
  )

  if (!student) return null

  const handleClose = () => {
    setError(null)
    closeDialog(DIALOG_KEY)
  }

  const handleTypeChange = (type: PaymentType) =>
    setForm((prev) => ({ ...prev, type, amount: "", description: "" }))

  const handlePackageChange = (packageId: string) =>
    setForm((prev) => ({ ...prev, packageId, amount: "" }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (isSubscription && (!subscriptionPackage?.lessonsPerWeek || !subscriptionPackage.durationDays)) {
      setError("Lessons per week and duration are required.")
      return
    }

    startTransition(async () => {
      try {
        const result = await createPayment({
          studentId: student.id,
          type: form.type,
          paymentMethod: form.paymentMethod,
          amount: amountValue,
          description: form.description.trim() || undefined,
          ...(isSubscription && subscriptionPackage && {
            packageName: subscriptionPackage.name,
            lessonsPerWeek: subscriptionPackage.lessonsPerWeek,
            durationDays: subscriptionPackage.durationDays,
            startDate: form.startDate ? format(form.startDate, "yyyy-MM-dd") : undefined,
            scheduleEntryIds: form.scheduleEntryIds,
          }),
        })

        if (!result.success) {
          setError(result.error)
          return
        }

        toast.success("Payment recorded", {
          description: `€${amountValue} ${form.type} for ${student.name}`,
          action: {
            label: "View Payments",
            onClick: () => router.push("/admin/income"),
          },
        })
        router.refresh()
        handleClose()
      } catch {
        setError("Something went wrong. Please try again.")
      }
    })
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

          {isSubscription && (
            <div className="grid gap-2">
              <Label>Package</Label>
              <Select value={form.packageId} onValueChange={handlePackageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.name} - €{pkg.priceAmount} ({pkg.lessonsPerWeek}x/week)
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_PACKAGE}>Custom (special deal)</SelectItem>
                </SelectContent>
              </Select>
              {packages.length === 0 && (
                <p className="text-xs text-destructive">
                  Could not load packages from Stripe. Use a custom package, or retry once Stripe is reachable.
                </p>
              )}
            </div>
          )}

          {isCustom && (
            <div className="grid gap-3 rounded-lg border p-3">
              <div className="grid gap-2">
                <Label htmlFor="customName">Package Name</Label>
                <Input
                  id="customName"
                  value={form.customName}
                  onChange={(e) => setForm((prev) => ({ ...prev, customName: e.target.value }))}
                  placeholder="e.g. Custom 1x/week"
                  maxLength={60}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="customLessons">Lessons / Week</Label>
                  <NumericInput
                    id="customLessons"
                    allowDecimal={false}
                    value={form.customLessonsPerWeek}
                    onChange={(value) => setForm((prev) => ({ ...prev, customLessonsPerWeek: value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customDuration">Duration (days)</Label>
                  <NumericInput
                    id="customDuration"
                    allowDecimal={false}
                    value={form.customDurationDays}
                    onChange={(value) => setForm((prev) => ({ ...prev, customDurationDays: value }))}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (€)</Label>
            <NumericInput
              id="amount"
              value={form.amount}
              onChange={(value) => setForm((prev) => ({ ...prev, amount: value }))}
              placeholder={stripePackage ? String(stripePackage.priceAmount) : undefined}
              required={!stripePackage}
            />
            {stripePackage && (
              <p className={`text-xs ${isSpecialPrice ? "text-amber-500" : "text-muted-foreground"}`}>
                {isSpecialPrice
                  ? `Special price - package price is €${stripePackage.priceAmount}`
                  : `Leave empty to use the package price (€${stripePackage.priceAmount})`}
              </p>
            )}
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

          {isSubscription && (
            <div className="grid gap-2">
              <Label>Subscription Start Date</Label>
              <DatePicker
                value={form.startDate}
                onChange={(date) => setForm((prev) => ({ ...prev, startDate: date }))}
                placeholder="Select start date"
              />
            </div>
          )}

          {isSubscription && (
            <ClassPicker
              value={form.scheduleEntryIds}
              onChange={handleClassesChange}
              lessonsPerWeek={subscriptionPackage?.lessonsPerWeek || undefined}
            />
          )}

          <div className="grid gap-2">
            <Label htmlFor="description">{isSubscription ? "Notes" : "Description"}</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder={isSubscription ? "e.g. Special price - friend discount" : "Optional notes..."}
              rows={2}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || amountValue <= 0}>
              {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              {`Record €${amountValue}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
