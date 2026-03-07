import { type IconType } from "react-icons";
import {
  IoCalendar,
  IoCard,
  IoCheckboxOutline,
  IoGridOutline,
  IoPeople,
  IoSchool,
  IoSettings,
  IoTrendingDown,
  IoTrendingUp,
} from "react-icons/io5";
import { IoMdStats } from "react-icons/io";

import { MAIL } from "@/data/config";

export const ADMIN_EMAILS = ["nikossoftwaredev@gmail.com", MAIL];

export const isAdminEmail = (email: string) =>
  ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase()
  );

export interface AdminNavItem {
  label: string;
  href: string;
  icon: IconType;
}

export interface AdminNavGroup {
  groupLabel: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    groupLabel: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: IoGridOutline }],
  },
  {
    groupLabel: "Classes",
    items: [
      { label: "Schedule", href: "/admin/schedule", icon: IoCalendar },
      {
        label: "Attendance",
        href: "/admin/attendance",
        icon: IoCheckboxOutline,
      },
      { label: "Instructors", href: "/admin/instructors", icon: IoPeople },
    ],
  },
  {
    groupLabel: "Business",
    items: [
      { label: "Students", href: "/admin/students", icon: IoSchool },
      {
        label: "Subscriptions",
        href: "/admin/subscriptions",
        icon: IoCard,
      },
      { label: "Income", href: "/admin/income", icon: IoTrendingUp },
      { label: "Expenses", href: "/admin/expenses", icon: IoTrendingDown },
      { label: "Reports", href: "/admin/reports", icon: IoMdStats },
    ],
  },
  {
    groupLabel: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: IoSettings }],
  },
];
