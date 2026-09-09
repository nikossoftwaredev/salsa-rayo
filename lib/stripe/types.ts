export interface StripePackage {
  id: string
  name: string
  description: string | null
  priceId: string
  priceAmount: number
  currency: string
  /** Classes per week, from the product's `lessonsPerWeek` metadata. */
  lessonsPerWeek: number
  /** Highlights the card on the pricing page, from `mostPopular` metadata. */
  isMostPopular: boolean
  /** One billing period in days, derived from the price's recurring interval. */
  durationDays: number
  metadata: Record<string, string>
  active: boolean
}

export interface CreateCheckoutInput {
  priceId: string
  customerId: string
  studentId: string
  locale: string
  couponId?: string
}

export interface GetOrCreateCustomerInput {
  email: string
  name: string
  metadata?: Record<string, string>
}
