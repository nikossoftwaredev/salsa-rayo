import { type IconType } from "react-icons";
import {
  IoCalendar,
  IoCard,
  IoCheckboxOutline,
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
    groupLabel: "School",
    items: [
      { label: "Students", href: "/admin", icon: IoSchool },
      {
        label: "Attendance",
        href: "/admin/attendance",
        icon: IoCheckboxOutline,
      },
      { label: "Stats", href: "/admin/stats", icon: IoMdStats },
    ],
  },
  {
    groupLabel: "Classes",
    items: [
      { label: "Schedule", href: "/admin/schedule", icon: IoCalendar },
      { label: "Instructors", href: "/admin/instructors", icon: IoPeople },
    ],
  },
  {
    groupLabel: "Finances",
    items: [
      {
        label: "Subscriptions",
        href: "/admin/subscriptions",
        icon: IoCard,
      },
      { label: "Income", href: "/admin/income", icon: IoTrendingUp },
      { label: "Expenses", href: "/admin/expenses", icon: IoTrendingDown },
    ],
  },
  {
    groupLabel: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: IoSettings }],
  },
];
