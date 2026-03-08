"use client"

import { IoCloseCircle } from "react-icons/io5"
import { cn } from "@/lib/utils"
import { RayoPoints } from "@/components/ui/rayo-points"
import { SubscriptionBadge } from "@/components/ui/subscription-badge"

interface AttendeeRowProps {
  student: {
    name: string
    email?: string
    rayoPoints: number
    subscriptionExpiresAt: Date | string | null
  }
  onRemove?: () => void
  onClick?: () => void
}

export const AttendeeRow = ({ student, onRemove, onClick }: AttendeeRowProps) => {
  const Wrapper = onClick ? "button" : "div"

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent",
        onClick && "cursor-pointer"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{student.name}</p>
        {student.email && (
          <p className="truncate text-xs text-muted-foreground">{student.email}</p>
        )}
      </div>

      <SubscriptionBadge expiresAt={student.subscriptionExpiresAt} />

      <RayoPoints points={student.rayoPoints} size="sm" />

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="shrink-0 cursor-pointer text-muted-foreground/40 transition-colors hover:text-destructive"
        >
          <IoCloseCircle size={18} />
        </button>
      )}
    </Wrapper>
  )
}
