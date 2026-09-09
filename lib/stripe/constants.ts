// Client-safe Stripe constants: no SDK import, so client components can use
// these without pulling the Stripe node library into the browser bundle.

/** Fallback billing period when a price has no recurring interval. */
export const DEFAULT_PERIOD_DAYS = 30

/**
 * Fallback when a Stripe product has no `lessonsPerWeek` metadata. This is a
 * real weekly attendance limit, shown as attended/limit in the admin panel, so
 * it must never fall through to 0.
 */
export const DEFAULT_LESSONS_PER_WEEK = 2
