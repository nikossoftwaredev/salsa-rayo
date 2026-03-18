import { stripe } from "./index"
import type { GetOrCreateCustomerInput } from "./types"

export const getOrCreateCustomer = async ({
  email,
  name,
  metadata,
}: GetOrCreateCustomerInput) => {
  const existing = await stripe.customers.list({ email, limit: 1 })

  if (existing.data.length > 0) return existing.data[0]

  return stripe.customers.create({
    email,
    name,
    metadata,
  })
}
