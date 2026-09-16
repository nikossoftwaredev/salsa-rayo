"use client"

import { useMemo } from "react"
import { CreditCard, AlertTriangle, XCircle, Banknote } from "lucide-react"
import { type SubscriptionWithDetails } from "@/server-actions/subscriptions/get-subscriptions"
import { SubscriptionsTable } from "./SubscriptionsTable"
import { StatCards, type StatCard } from "../StatCards"

interface SubscriptionsViewProps {
  data: SubscriptionWithDetails[]
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
      <StatCards stats={stats} />
      <SubscriptionsTable data={data} />
    </div>
  )
}
