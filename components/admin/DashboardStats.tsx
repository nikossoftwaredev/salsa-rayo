"use client"

import { useState } from "react"
import { IoSchool, IoTrendingUp, IoCard, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"
import { MdDashboard } from "react-icons/md"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { IconType } from "react-icons"

const STAT_ICONS: Record<string, IconType> = {
  "Total Students": IoSchool,
  "Monthly Income": IoTrendingUp,
  "Active Subscriptions": IoCard,
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
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {visible ? <IoEyeOffOutline size={22} /> : <IoEyeOutline size={22} />}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = STAT_ICONS[stat.title] ?? MdDashboard
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${!visible ? "blur-md select-none" : ""}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
