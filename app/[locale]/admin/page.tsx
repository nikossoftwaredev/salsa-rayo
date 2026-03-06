import { IoSchool, IoTrendingUp, IoCard } from "react-icons/io5";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensitiveValue } from "@/components/admin/SensitiveValue";
import { prisma } from "@/lib/db";

const AdminDashboard = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [studentCount, monthlyIncome, activeSubCount] = await Promise.all([
    prisma.student.count(),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.subscription.count({
      where: { isActive: true, expiresAt: { gte: new Date() } },
    }),
  ]);

  const stats = [
    {
      title: "Total Students",
      value: studentCount.toString(),
      description: "Registered students",
      icon: IoSchool,
      sensitive: false,
    },
    {
      title: "Monthly Income",
      value: `€${(monthlyIncome._sum.amount ?? 0).toFixed(0)}`,
      description: "This month",
      icon: IoTrendingUp,
      sensitive: true,
    },
    {
      title: "Active Subscriptions",
      value: activeSubCount.toString(),
      description: "Currently active",
      icon: IoCard,
      sensitive: false,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.sensitive ? (
                  <SensitiveValue value={stat.value} />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
