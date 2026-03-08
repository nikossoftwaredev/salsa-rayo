import { DashboardStats } from "@/components/admin/DashboardStats"
import { AreaChartCard } from "@/components/admin/stats/AreaChartCard"
import { SubscriptionPieChart } from "@/components/admin/stats/SubscriptionPieChart"
import { prisma } from "@/lib/db"

const getWeekLabel = (date: Date) => {
  const day = date.getDate()
  const month = date.toLocaleString("en", { month: "short" })
  return `${day} ${month}`
}

const getMonthLabel = (date: Date) =>
  date.toLocaleString("en", { month: "short", year: "2-digit" })

const StatsPage = async () => {
  const now = new Date()

  const startOfMonth = new Date(now)
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // 12 weeks ago
  const twelveWeeksAgo = new Date(now)
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84)
  twelveWeeksAgo.setHours(0, 0, 0, 0)

  // 12 months ago
  const twelveMonthsAgo = new Date(now)
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
  twelveMonthsAgo.setDate(1)
  twelveMonthsAgo.setHours(0, 0, 0, 0)

  const [
    studentCount,
    monthlyIncome,
    activeSubCount,
    attendanceRecords,
    subscriptionsByPlan,
    studentRecords,
    studentsBeforeWindow,
  ] = await Promise.all([
    prisma.student.count({ where: { isActive: true } }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.subscription.count({
      where: { isActive: true, expiresAt: { gte: now } },
    }),
    prisma.attendance.findMany({
      where: { createdAt: { gte: twelveWeeksAgo } },
      select: { createdAt: true },
    }),
    prisma.subscription.groupBy({
      by: ["packageName"],
      _count: { id: true },
      where: { isActive: true, expiresAt: { gte: now } },
    }),
    prisma.student.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.student.count({
      where: { createdAt: { lt: twelveMonthsAgo } },
    }),
  ])

  const stats = [
    {
      title: "Total Students",
      value: studentCount.toString(),
      description: "Registered students",
    },
    {
      title: "Monthly Income",
      value: `€${(monthlyIncome._sum.amount ?? 0).toFixed(0)}`,
      description: "This month",
    },
    {
      title: "Active Subscriptions",
      value: activeSubCount.toString(),
      description: "Currently active",
    },
  ]

  // Process attendance data into weekly buckets
  const attendanceByWeek = new Map<string, number>()
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - i * 7)
    weekStart.setHours(0, 0, 0, 0)
    attendanceByWeek.set(getWeekLabel(weekStart), 0)
  }
  for (const record of attendanceRecords) {
    const weeksAgo = Math.floor(
      (now.getTime() - record.createdAt.getTime()) / (7 * 24 * 60 * 60 * 1000)
    )
    if (weeksAgo >= 0 && weeksAgo < 12) {
      const weekStart = new Date(now)
      weekStart.setDate(weekStart.getDate() - weeksAgo * 7)
      weekStart.setHours(0, 0, 0, 0)
      const label = getWeekLabel(weekStart)
      attendanceByWeek.set(label, (attendanceByWeek.get(label) ?? 0) + 1)
    }
  }
  const attendanceData = Array.from(attendanceByWeek, ([week, count]) => ({
    week,
    count,
  }))

  // Process subscription distribution
  const subscriptionData = subscriptionsByPlan.map((s) => ({
    name: s.packageName,
    count: s._count.id,
  }))

  // Process student growth into monthly buckets (cumulative)
  const studentsByMonth = new Map<string, number>()
  for (let i = 12; i >= 0; i--) {
    const monthDate = new Date(now)
    monthDate.setMonth(monthDate.getMonth() - i)
    monthDate.setDate(1)
    studentsByMonth.set(getMonthLabel(monthDate), 0)
  }
  for (const student of studentRecords) {
    const monthDate = new Date(student.createdAt)
    monthDate.setDate(1)
    const label = getMonthLabel(monthDate)
    if (studentsByMonth.has(label)) {
      studentsByMonth.set(label, (studentsByMonth.get(label) ?? 0) + 1)
    }
  }

  const monthlyEntries = Array.from(studentsByMonth, ([month, count]) => ({
    month,
    count,
  }))
  const studentGrowthData = monthlyEntries.reduce<
    { month: string; total: number }[]
  >((acc, { month, count }) => {
    const prev = acc.length > 0 ? acc[acc.length - 1].total : studentsBeforeWindow
    acc.push({ month, total: prev + count })
    return acc
  }, [])

  return (
    <div className="space-y-8">
      <DashboardStats stats={stats} />
      <div className="grid gap-6 lg:grid-cols-2">
        <AreaChartCard
          title="Attendance"
          description="Weekly attendance over the last 12 weeks"
          data={attendanceData}
          xDataKey="week"
          yDataKey="count"
          label="Attendees"
          color="var(--color-primary)"
        />
        <SubscriptionPieChart data={subscriptionData} />
      </div>
      <AreaChartCard
        title="Student Growth"
        description="Cumulative student registrations over the last 12 months"
        data={studentGrowthData}
        xDataKey="month"
        yDataKey="total"
        label="Students"
        color="var(--color-chart-2)"
      />
    </div>
  )
}

export default StatsPage
