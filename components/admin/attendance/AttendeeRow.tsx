"use client"

import { cn } from "@/lib/utils"
import { RayoPoints } from "@/components/ui/rayo-points"
import { SubscriptionBadge } from "@/components/ui/subscription-badge"

interface AttendeeRowProps {
  student: {
    name: string
    rayoPoints: number
    subscriptionExpiresAt: Date | string | null
  }
  onRemove?: () => void
  onClick?: () => void
}

const shortenName = (name: string) => {
  const parts = name.trim().split(/\s+/)
  if (parts.length < 2) return name
  return `${parts[0]} ${parts[parts.length - 1].slice(0, 3)}.`
}

export const AttendeeRow = ({ student, onRemove, onClick }: AttendeeRowProps) => {
  const action = onClick ?? onRemove
  const Wrapper = action ? "button" : "div"

  return (
    <Wrapper
      type={action ? "button" : undefined}
      onClick={action}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-accent sm:gap-3 sm:px-3 sm:py-2",
        action && "cursor-pointer"
      )}
    >
      <p className="min-w-0 flex-1 truncate text-sm font-medium" title={student.name}>{shortenName(student.name)}</p>

      <SubscriptionBadge expiresAt={student.subscriptionExpiresAt} />

      <RayoPoints points={student.rayoPoints} size="sm" />
    </Wrapper>
  )
}
