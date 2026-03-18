export interface StripePackage {
  id: string
  name: string
  description: string | null
  priceId: string
  priceAmount: number
  currency: string
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
