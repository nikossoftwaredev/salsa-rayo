import { type LucideIcon } from "lucide-react"

export interface StatCard {
  label: string
  value: string | number
  icon: LucideIcon
  colorClass: string
  description?: string
}

interface StatCardsProps {
  stats: StatCard[]
}

export const StatCards = ({ stats }: StatCardsProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map((stat) => (
      <div key={stat.label} className="rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <stat.icon className={`size-5 ${stat.colorClass}`} />
        </div>
        <p className="mt-2 text-2xl font-bold">{stat.value}</p>
        {stat.description && (
          <p className="text-xs text-muted-foreground">{stat.description}</p>
        )}
      </div>
    ))}
  </div>
)
