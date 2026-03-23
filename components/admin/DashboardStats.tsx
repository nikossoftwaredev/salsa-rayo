"use client"

import { useState } from "react"
import { GraduationCap, TrendingUp, CreditCard, Eye, EyeOff, LayoutDashboard, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
const STAT_ICONS: Record<string, LucideIcon> = {
  "Total Students": GraduationCap,
  "Monthly Income": TrendingUp,
  "Active Subscriptions": CreditCard,
}

const STAT_LINKS: Record<string, string> = {
  "Total Students": "/admin",
  "Monthly Income": "/admin/income",
  "Active Subscriptions": "/admin/subscriptions",
}

interface Stat {
  title: string
  value: string
  description: string
}

interface DashboardStatsProps {
  stats: Stat[]
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-2xl font-bold tracking-tight">Stats</h2>
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = STAT_ICONS[stat.title] ?? LayoutDashboard
          const href = STAT_LINKS[stat.title]
          return (
            <Link key={stat.title} href={href ?? "/admin"} className="group">
              <Card className="transition-colors group-hover:border-primary/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${!visible ? "blur-md select-none" : ""}`}>{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
