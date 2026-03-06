import { IoFlash } from "react-icons/io5"
import { cn } from "@/lib/utils"
import { compactFormatter } from "@/lib/format"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RayoPointsProps {
  points: number
  size?: "sm" | "default"
  showTooltip?: boolean
  className?: string
}

export const RayoPoints = ({ points, size = "default", showTooltip = false, className }: RayoPointsProps) => {
  if (points <= 0) return null

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-yellow-400",
        size === "sm" ? "text-xs" : "text-sm font-semibold",
        className
      )}
    >
      <IoFlash size={size === "sm" ? 12 : 14} />
      {compactFormatter.format(points)}
    </span>
  )

  if (!showTooltip) return content

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent>Points earned by attending classes. Use them for gifts or discounts!</TooltipContent>
    </Tooltip>
  )
}
