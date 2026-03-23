import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { compactFormatter } from "@/lib/format"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface RayoPointsProps {
  points: number
  size?: "sm" | "default"
  showPopover?: boolean
  className?: string
}

export const RayoPoints = ({ points, size = "default", showPopover = false, className }: RayoPointsProps) => {
  if (points < 0) return null

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-yellow-400",
        showPopover && "cursor-pointer rayo-shake",
        size === "sm" ? "text-xs" : "text-sm font-semibold",
        className
      )}
    >
      <Zap className={size === "sm" ? "size-3" : "size-3.5"} />
      {compactFormatter.format(points)}
    </span>
  )

  if (!showPopover) return content

  return (
    <Popover>
      <PopoverTrigger asChild>{content}</PopoverTrigger>
      <PopoverContent className="w-auto px-4 py-3 text-center">
        <p className="text-sm font-semibold">Rayo Points</p>
        <p className="text-xs text-muted-foreground">Coming Soon...</p>
      </PopoverContent>
    </Popover>
  )
}
