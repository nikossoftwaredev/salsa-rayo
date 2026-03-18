"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

const CONFETTI_COLORS = ["#5b4fdb", "#d946ef", "#fbbf24", "#34d399"]
const BASE_CONFETTI = { particleCount: 3, spread: 55, colors: CONFETTI_COLORS }

export const useConfetti = (durationMs = 2500) => {
  useEffect(() => {
    const end = Date.now() + durationMs
    let rafId = 0
    const frame = () => {
      confetti({ ...BASE_CONFETTI, angle: 60, origin: { x: 0, y: 0.7 } })
      confetti({ ...BASE_CONFETTI, angle: 120, origin: { x: 1, y: 0.7 } })
      if (Date.now() < end) rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafId)
  }, [durationMs])
}
