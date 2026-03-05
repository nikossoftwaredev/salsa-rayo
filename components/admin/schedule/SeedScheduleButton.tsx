"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useConfirmStore } from "@/lib/stores/confirm-store"
import { seedSchedule } from "@/server-actions/schedule/seed-schedule"

export const SeedScheduleButton = () => {
  const router = useRouter()
  const { confirm } = useConfirmStore()
  const [loading, setLoading] = useState(false)

  const handleSeed = () => {
    confirm({
      title: "Seed Schedule Data",
      description: "This will populate the schedule with default data. Continue?",
      actionLabel: "Confirm",
      onConfirm: async () => {
        setLoading(true)
        try {
          const result = await seedSchedule()
          if (result.success) router.refresh()
        } finally {
          setLoading(false)
        }
      },
    })
  }

  return (
    <Button onClick={handleSeed} disabled={loading} variant="outline">
      {loading ? "Seeding..." : "Seed Data"}
    </Button>
  )
}
