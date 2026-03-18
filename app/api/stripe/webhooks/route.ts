import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { constructWebhookEvent, isCheckoutSessionCompleted } from "@/lib/stripe/webhooks"
import { fulfillSubscription } from "@/server-actions/payments/fulfill-subscription"
import { issueInvoice } from "@/lib/invoicing/issue-invoice"

export const POST = async (request: NextRequest) => {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event
  try {
    event = constructWebhookEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error("[Stripe Webhook] Signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    if (isCheckoutSessionCompleted(event)) {
      await handleCheckoutCompleted(event.data.object)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[Stripe Webhook] Handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

const handleCheckoutCompleted = async (
  session: import("stripe").Stripe.Checkout.Session
) => {
  const studentId = session.metadata?.studentId
  if (!studentId) {
    console.error("[Stripe Webhook] No studentId in checkout metadata")
    return
  }

  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : (session.payment_intent as { id: string } | null)?.id

  // Idempotency: check if we already processed this
  if (paymentIntentId) {
    const existingTx = await prisma.transaction.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    })
    if (existingTx) return
  }

  // Retrieve line items to get product details
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
  })

  const item = lineItems.data[0]
  const price = item?.price
  const product = price?.product as import("stripe").Stripe.Product | undefined

  const amount = (session.amount_total || 0) / 100
  const packageName = product?.name || "Rayo Package"

  const result = await fulfillSubscription({
    studentId,
    packageName,
    lessonsPerWeek: parseInt(product?.metadata?.lessonsPerWeek || "2"),
    amount,
    paymentMethod: "stripe",
    durationDays: parseInt(product?.metadata?.durationDays || "30"),
    description: `${packageName} - Stripe payment`,
    stripePaymentIntentId: paymentIntentId || undefined,
  })

  // Issue invoice instantly for Stripe payments
  try {
    await issueInvoice({
      transactionId: result.transactionId,
      amount,
      paymentMethod: "stripe",
      description: `${packageName} - Stripe payment`,
      studentName: result.studentName,
      studentAddress: result.studentAddress,
    })
  } catch (error) {
    console.error("[Stripe Webhook] Auto-invoice issuance failed:", error)
  }
}
