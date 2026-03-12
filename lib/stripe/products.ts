import { stripe } from "./index"
import type { StripePackage } from "./types"

export const listActiveProducts = async (): Promise<StripePackage[]> => {
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  })

  return products.data
    .filter((p) => p.default_price && typeof p.default_price !== "string")
    .map((product) => {
      const price = product.default_price as import("stripe").Stripe.Price
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        priceId: price.id,
        priceAmount: price.unit_amount ? price.unit_amount / 100 : 0,
        currency: price.currency,
        metadata: product.metadata,
        active: product.active,
      }
    })
    .sort((a, b) => a.priceAmount - b.priceAmount)
}
