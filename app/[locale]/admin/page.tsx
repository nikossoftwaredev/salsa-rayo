import { DashboardStats } from "@/components/admin/DashboardStats";
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
  ];

  return <DashboardStats stats={stats} />;
};

export default AdminDashboard;
