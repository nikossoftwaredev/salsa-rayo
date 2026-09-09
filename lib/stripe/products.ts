import { unstable_cache } from "next/cache"
import type Stripe from "stripe"
import { stripe } from "./index"
import { DEFAULT_LESSONS_PER_WEEK, DEFAULT_PERIOD_DAYS } from "./constants"
import type { StripePackage } from "./types"

const DAYS_PER_INTERVAL: Record<Stripe.Price.Recurring.Interval, number> = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
}

const toDurationDays = (price: Stripe.Price) => {
  if (!price.recurring) return DEFAULT_PERIOD_DAYS
  return DAYS_PER_INTERVAL[price.recurring.interval] * price.recurring.interval_count
}

const toPackage = (product: Stripe.Product, price: Stripe.Price): StripePackage => {
  const metadata = Object.fromEntries(
    Object.entries(product.metadata).map(([k, v]) => [k.trim(), v.trim()])
  )

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    priceId: price.id,
    priceAmount: price.unit_amount ? price.unit_amount / 100 : 0,
    currency: price.currency,
    lessonsPerWeek: parseInt(metadata.lessonsPerWeek) || DEFAULT_LESSONS_PER_WEEK,
    isMostPopular: metadata.mostPopular === "true",
    durationDays: toDurationDays(price),
    metadata,
    active: product.active,
  }
}

export const listActiveProducts = async (): Promise<StripePackage[]> => {
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  })

  return products.data
    .filter((p) => p.default_price && typeof p.default_price !== "string")
    .map((product) => toPackage(product, product.default_price as Stripe.Price))
    .sort((a, b) => a.priceAmount - b.priceAmount)
}

// Last known-good list. Prices are the one thing we must never guess, so when
// Stripe is unreachable we serve what it told us last rather than an empty
// pricing page. Module scope, so it is per server instance and starts empty
// after a cold start - callers still have to handle an empty list.
let lastGoodPackages: StripePackage[] = []

const getCachedPackages = unstable_cache(
  async () => {
    try {
      const packages = await listActiveProducts()
      if (packages.length) lastGoodPackages = packages
      return packages
    } catch (error) {
      console.error("[Stripe Products] falling back to last known prices", error)
      return lastGoodPackages
    }
  },
  ["stripe-packages"],
  { revalidate: 300 }
)

/**
 * The single source of truth for package names, prices, class counts and
 * billing periods across the public site and the admin panel. Never hardcode
 * these - they are edited in the Stripe dashboard.
 */
export const getStripePackages = async (): Promise<StripePackage[]> => {
  try {
    return await getCachedPackages()
  } catch (error) {
    console.error("[Stripe Products]", error)
    return lastGoodPackages
  }
}
