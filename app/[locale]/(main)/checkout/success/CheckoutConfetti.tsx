"use client"

import { useConfetti } from "@/hooks/use-confetti"

export const CheckoutConfetti = () => {
  useConfetti(2500)
  return null
}
