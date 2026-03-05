import { IoFlash } from "react-icons/io5"
import { cn } from "@/lib/utils"
import { compactFormatter } from "@/lib/format"

interface RayoPointsProps {
  points: number
  size?: "sm" | "default"
  className?: string
}

export const RayoPoints = ({ points, size = "default", className }: RayoPointsProps) => {
  if (points <= 0) return null

  return (
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
}
