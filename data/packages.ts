import { DEFAULT_PERIOD_DAYS } from "@/lib/stripe/constants"

// Package names, prices, class counts and billing periods live in Stripe and
// are read through `getStripePackages()`. Only pricing that Stripe does not
// manage belongs in this file.

/**
 * Student / under-26 discount, applied on top of every monthly package.
 * Mirrors the percent_off of the Stripe coupon in STRIPE_STUDENT_COUPON_ID -
 * change both together or checkout will charge a different price than the
 * pricing page advertises.
 */
export const STUDENT_DISCOUNT_PERCENT = 20

export const applyStudentDiscount = (price: number) =>
  Math.floor(price * (1 - STUDENT_DISCOUNT_PERCENT / 100))

// Single drop-in class (one lesson, no subscription).
// Deliberately excluded from the student discount.
export const DROP_IN = {
  price: 12,
  durationMinutes: 50,
} as const

/**
 * One subscription period in ms, used to roll `expiresAt` back when a
 * subscription payment is deleted. Every package bills monthly, so this is a
 * constant rather than a per-package lookup.
 */
export const SUBSCRIPTION_PERIOD_MS = DEFAULT_PERIOD_DAYS * 24 * 60 * 60 * 1000
