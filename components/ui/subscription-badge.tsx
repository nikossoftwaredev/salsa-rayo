import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SubscriptionBadgeProps {
  expiresAt: Date | string | null
  className?: string
}

export const SubscriptionBadge = ({ expiresAt, className }: SubscriptionBadgeProps) => {
  if (!expiresAt) {
    return (
      <Badge className={cn("border-transparent bg-muted text-muted-foreground", className)}>
        No sub
      </Badge>
    )
  }

  const now = new Date()
  const expires = new Date(expiresAt)
  const daysRemaining = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  let colorClass = "bg-emerald-500/15 text-emerald-500"
  if (daysRemaining <= 0) colorClass = "bg-red-500/15 text-red-500"
  else if (daysRemaining <= 5) colorClass = "bg-amber-500/15 text-amber-500"

  return (
    <Badge className={cn("border-transparent", colorClass, className)}>
      {daysRemaining}d
    </Badge>
  )
}
