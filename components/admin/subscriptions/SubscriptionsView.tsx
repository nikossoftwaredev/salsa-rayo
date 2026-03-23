"use client"

import { useMemo } from "react"
import { CreditCard, AlertTriangle, XCircle, Banknote } from "lucide-react"
import { type SubscriptionWithDetails } from "@/server-actions/subscriptions/get-subscriptions"
import { SubscriptionsTable } from "./SubscriptionsTable"

interface SubscriptionsViewProps {
  data: SubscriptionWithDetails[]
}

interface StatCard {
  label: string
  value: string | number
  icon: React.ElementType
  colorClass: string
}

export const SubscriptionsView = ({ data }: SubscriptionsViewProps) => {
  const stats = useMemo(() => {
    const now = new Date()
    const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
    let active = 0
    let expiringSoon = 0
    let expired = 0
    let monthlyRevenue = 0

    for (const sub of data) {
      const expiresAt = new Date(sub.expiresAt)
      if (expiresAt > now && sub.isActive) {
        active++
        if (expiresAt <= fiveDaysFromNow) expiringSoon++
      } else {
        expired++
      }
      // Sum actual transaction amounts from this month (already filtered server-side)
      for (const tx of sub.transactions) monthlyRevenue += tx.amount
    }

    return [
      { label: "Active", value: active, icon: CreditCard, colorClass: "text-emerald-500" },
      { label: "Expiring Soon", value: expiringSoon, icon: AlertTriangle, colorClass: "text-amber-500" },
      { label: "Expired", value: expired, icon: XCircle, colorClass: "text-red-500" },
      { label: "Monthly Revenue", value: `€${monthlyRevenue.toFixed(0)}`, icon: Banknote, colorClass: "text-primary" },
    ] satisfies StatCard[]
  }, [data])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className={`size-5 ${stat.colorClass}`} />
            </div>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <SubscriptionsTable data={data} />
    </div>
  )
}
