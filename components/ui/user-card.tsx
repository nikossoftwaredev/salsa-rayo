import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SubscriptionBadge } from "@/components/ui/subscription-badge"
import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/format"

interface UserCardProps {
  name: string
  email: string
  image?: string | null
  subscriptionExpiresAt?: Date | string | null
  onClick?: () => void
  className?: string
}

export const UserCard = ({
  name,
  email,
  image,
  subscriptionExpiresAt,
  onClick,
  className,
}: UserCardProps) => {
  const firstName = name.split(" ")[0]
  const initials = getInitials(name)

  const content = (
    <>
      <Avatar className="size-8 rounded-lg">
        {image && <AvatarImage src={image} alt={firstName} />}
        <AvatarFallback className="rounded-lg text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 flex-1 leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-semibold">{firstName}</span>
          <SubscriptionBadge expiresAt={subscriptionExpiresAt ?? null} />
        </div>
        <span className="truncate text-xs text-muted-foreground">{email}</span>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn("flex w-full items-center gap-2 text-left", className)}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={cn("flex items-center gap-2 text-left", className)}>
      {content}
    </div>
  )
}
