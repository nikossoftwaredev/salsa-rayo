import { toast } from "sonner"

export const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

export const copyToClipboard = (value: string, label: string) => {
  navigator.clipboard.writeText(value)
  toast.success(`${label} copied`, { description: value })
}

export const formatDate = (date: Date | null | undefined) => {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
