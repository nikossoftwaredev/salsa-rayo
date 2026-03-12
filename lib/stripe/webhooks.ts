import type Stripe from "stripe"
import { stripe } from "./index"

export const constructWebhookEvent = (
  body: string,
  signature: string,
  secret: string
): Stripe.Event => {
  return stripe.webhooks.constructEvent(body, signature, secret)
}

export const isCheckoutSessionCompleted = (
  event: Stripe.Event
): event is Stripe.Event & { data: { object: Stripe.Checkout.Session } } => {
  return event.type === "checkout.session.completed"
}
