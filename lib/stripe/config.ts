export const STRIPE_CONFIG = {
  currency: "eur" as const,
  successUrl: (locale: string) =>
    `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: (locale: string) =>
    `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/pricing`,
  studentCouponId: process.env.STRIPE_STUDENT_COUPON_ID,
}
