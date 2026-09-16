"use client"

import { useMemo } from "react"
import { Banknote, BarChart3, Calendar, TrendingUp } from "lucide-react"
import { type TransactionWithStudent } from "@/server-actions/payments/get-transactions"
import { AreaChartCard } from "../stats/AreaChartCard"
import { StatCards, type StatCard } from "../StatCards"
import { IncomeTable } from "./IncomeTable"

interface IncomeViewProps {
  data: TransactionWithStudent[]
}

interface MonthTotal {
  key: string
  label: string
  total: number
  count: number
}

const CHART_MONTHS = 12

const formatEuro = (amount: number) => `€${Math.round(amount).toLocaleString("en")}`

const monthKey = (year: number, month: number) => `${year}-${month}`

const monthLabel = (year: number, month: number) =>
  new Date(year, month, 1).toLocaleString("en", { month: "short", year: "numeric" })

/** Every month from the first income up to the current one, oldest first, zero-filled. */
const buildMonthTotals = (data: TransactionWithStudent[], now: Date) => {
  const totals = new Map<string, { total: number; count: number }>()
  let first = now

  for (const transaction of data) {
    const date = new Date(transaction.createdAt)
    if (date < first) first = date
    const key = monthKey(date.getFullYear(), date.getMonth())
    const current = totals.get(key) ?? { total: 0, count: 0 }
    totals.set(key, { total: current.total + transaction.amount, count: current.count + 1 })
  }

  const months: MonthTotal[] = []
  const cursor = new Date(first.getFullYear(), first.getMonth(), 1)
  while (cursor <= now) {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const key = monthKey(year, month)
    const { total, count } = totals.get(key) ?? { total: 0, count: 0 }
    months.push({ key, label: monthLabel(year, month), total, count })
    cursor.setMonth(month + 1)
  }
  return months
}

export const IncomeView = ({ data }: IncomeViewProps) => {
  const months = useMemo(() => buildMonthTotals(data, new Date()), [data])

  const stats = useMemo(() => {
    const now = new Date()
    const thisYear = now.getFullYear()

    const current = months[months.length - 1]
    const previous = months[months.length - 2]
    // Average over finished months only, so the running month doesn't drag it down
    const completed = months.length > 1 ? months.slice(0, -1) : months
    const completedTotal = completed.reduce((sum, m) => sum + m.total, 0)

    const allTime = data.reduce((sum, t) => sum + t.amount, 0)
    const ytd = data
      .filter((t) => new Date(t.createdAt).getFullYear() === thisYear)
      .reduce((sum, t) => sum + t.amount, 0)

    return [
      {
        label: "This Month",
        value: formatEuro(current?.total ?? 0),
        icon: Calendar,
        colorClass: "text-emerald-500",
        description: previous ? `Last month: ${formatEuro(previous.total)}` : undefined,
      },
      {
        label: "Avg Per Month",
        value: formatEuro(completed.length > 0 ? completedTotal / completed.length : 0),
        icon: BarChart3,
        colorClass: "text-blue-500",
        description: `Over ${completed.length} month${completed.length === 1 ? "" : "s"}`,
      },
      {
        label: "Total YTD",
        value: formatEuro(ytd),
        icon: TrendingUp,
        colorClass: "text-amber-500",
        description: `Since Jan ${thisYear}`,
      },
      {
        label: "Total All Time",
        value: formatEuro(allTime),
        icon: Banknote,
        colorClass: "text-primary",
        description: `${data.length} payments, avg ${formatEuro(data.length > 0 ? allTime / data.length : 0)}`,
      },
    ] satisfies StatCard[]
  }, [data, months])

  const chartData = useMemo(
    () => months.slice(-CHART_MONTHS).map((m) => ({ month: m.label, total: Math.round(m.total) })),
    [months]
  )

  const monthsNewestFirst = useMemo(() => [...months].reverse(), [months])

  return (
    <div className="space-y-6">
      <StatCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AreaChartCard
            title="Monthly Income"
            description={`Total income per month, last ${CHART_MONTHS} months`}
            data={chartData}
            xDataKey="month"
            yDataKey="total"
            label="Income (€)"
            color="var(--color-chart-2)"
          />
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border bg-card lg:h-[430px]">
          <div className="border-b px-4 py-3">
            <p className="font-semibold">Totals By Month</p>
            <p className="text-xs text-muted-foreground">All months since the first payment</p>
          </div>
          <div className="max-h-[320px] flex-1 overflow-y-auto px-4 py-2 lg:max-h-none">
            {monthsNewestFirst.map((m) => (
              <div key={m.key} className="flex items-center justify-between border-b py-2 last:border-b-0">
                <div>
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.count} payment{m.count === 1 ? "" : "s"}
                  </p>
                </div>
                <p className="font-semibold tabular-nums">{formatEuro(m.total)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <IncomeTable data={data} />
    </div>
  )
}
