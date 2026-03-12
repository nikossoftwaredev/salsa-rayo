import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getOrCreateCustomer } from "@/lib/stripe/customers"
import { createCheckoutSession } from "@/lib/stripe/checkout"

export const POST = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { priceId, isStudentDiscount, locale = "en" } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: "priceId is required" },
        { status: 400 }
      )
    }

    const student = await prisma.student.findFirst({
      where: { user: { email: session.user.email } },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      )
    }

    let stripeCustomerId = student.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await getOrCreateCustomer({
        email: session.user.email,
        name: student.name,
        metadata: { studentId: student.id },
      })
      stripeCustomerId = customer.id

      await prisma.student.update({
        where: { id: student.id },
        data: { stripeCustomerId },
      })
    }

    const couponId =
      isStudentDiscount && process.env.STRIPE_STUDENT_COUPON_ID
        ? process.env.STRIPE_STUDENT_COUPON_ID
        : undefined

    const checkoutSession = await createCheckoutSession({
      priceId,
      customerId: stripeCustomerId,
      studentId: student.id,
      locale,
      couponId,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("[Stripe Checkout]", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
