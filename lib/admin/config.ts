import {
  type LucideIcon,
  Calendar,
  CreditCard,
  ClipboardCheck,
  Users,
  GraduationCap,
  Settings,
  TrendingDown,
  TrendingUp,
  BarChart3,
} from "lucide-react";

import { MAIL } from "@/data/config";

export const ADMIN_EMAILS = ["nikossoftwaredev@gmail.com", MAIL];

export const isAdminEmail = (email: string) =>
  ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase()
  );

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  groupLabel: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    groupLabel: "School",
    items: [
      { label: "Students", href: "/admin", icon: GraduationCap },
      {
        label: "Attendance",
        href: "/admin/attendance",
        icon: ClipboardCheck,
      },
      { label: "Stats", href: "/admin/stats", icon: BarChart3 },
    ],
  },
  {
    groupLabel: "Classes",
    items: [
      { label: "Schedule", href: "/admin/schedule", icon: Calendar },
      { label: "Instructors", href: "/admin/instructors", icon: Users },
    ],
  },
  {
    groupLabel: "Finances",
    items: [
      {
        label: "Subscriptions",
        href: "/admin/subscriptions",
        icon: CreditCard,
      },
      { label: "Income", href: "/admin/income", icon: TrendingUp },
      { label: "Expenses", href: "/admin/expenses", icon: TrendingDown },
    ],
  },
  {
    groupLabel: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];
