export const PAYMENT_TYPES = [
  { value: "subscription", label: "Subscription" },
  { value: "drop-in", label: "Drop-in" },
  { value: "private", label: "Private Lesson" },
] as const

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "stripe", label: "Stripe" },
] as const

export type PaymentType = (typeof PAYMENT_TYPES)[number]["value"]
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"]

export const TYPE_LABELS: Record<string, string> = Object.fromEntries(
  PAYMENT_TYPES.map((t) => [t.value, t.label])
)

export const METHOD_LABELS: Record<string, string> = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.value, m.label])
)
