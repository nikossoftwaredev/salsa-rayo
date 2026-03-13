import { stripe } from "./index"
import { STRIPE_CONFIG } from "./config"
import type { CreateCheckoutInput } from "./types"

export const createCheckoutSession = async ({
  priceId,
  customerId,
  studentId,
  locale,
  couponId,
}: CreateCheckoutInput) => {
  return stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    payment_method_types: ["card", "link"],
    success_url: STRIPE_CONFIG.successUrl(locale),
    cancel_url: STRIPE_CONFIG.cancelUrl(locale),
    ...(couponId
      ? { discounts: [{ coupon: couponId }] }
      : { allow_promotion_codes: true }),
    locale: locale === "el" ? "el" : locale === "es" ? "es" : "en",
    metadata: { studentId },
    payment_intent_data: {
      metadata: { studentId },
    },
  })
}
