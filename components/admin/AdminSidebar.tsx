"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IoHome, IoPeople, IoSettings } from "react-icons/io5"
import { MdInventory } from "react-icons/md"

interface AdminSidebarProps {
  locale: string
}

export const AdminSidebar = ({ locale }: AdminSidebarProps) => {
  const pathname = usePathname()
  
  const menuItems = [
    {
      label: "Dashboard",
      href: `/${locale}/admin`,
      icon: IoHome,
    },
    {
      label: "Clients",
      href: `/${locale}/admin/clients`,
      icon: IoPeople,
    },
    {
      label: "Products",
      href: `/${locale}/admin/products`,
      icon: MdInventory,
    },
    {
      label: "Settings",
      href: `/${locale}/admin/settings`,
      icon: IoSettings,
    },
  ]
  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}