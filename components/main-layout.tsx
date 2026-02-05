"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  BarChart3,
  Box,
  ClipboardList,
  Home,
  Layers,
  LogOut,
  Settings,
  Truck,
  Users,
  AlertTriangle,
  Camera,
  Calendar,
  ScanLine,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserRole = "admin" | "driver" | "warehouse" | "customer" | null

interface MainLayoutProps {
  children: React.ReactNode
  userRole?: UserRole
  userName?: string
}

export function MainLayout({ children, userRole = null, userName = "User" }: MainLayoutProps) {
  const pathname = usePathname()

  // Navigation items based on user role
  const getNavItems = (role: UserRole) => {
    switch (role) {
      case "admin":
        return [
          { name: "Dashboard", href: "/admin", icon: Home },
          { name: "Orders", href: "/admin/orders", icon: ClipboardList },
          { name: "Drivers", href: "/admin/drivers", icon: Truck },
          { name: "Inventory", href: "/admin/inventory", icon: Box },
          { name: "Issues", href: "/admin/issues", icon: AlertTriangle },
          { name: "Proof of Delivery", href: "/admin/pod", icon: Camera },
          { name: "Reports", href: "/admin/reports", icon: BarChart3 },
          { name: "Users", href: "/admin/users", icon: Users },
          { name: "Settings", href: "/admin/settings", icon: Settings },
        ]
      case "driver":
        return [
          { name: "Assignments", href: "/driver", icon: ClipboardList },
          { name: "Status Updates", href: "/driver/status", icon: Truck },
          { name: "Proof of Delivery", href: "/driver/pod", icon: Camera },
          { name: "Report Issue", href: "/driver/issues", icon: AlertTriangle },
          { name: "Earnings & History", href: "/driver/earnings", icon: Calendar },
          { name: "Settings", href: "/driver/settings", icon: Settings },
        ]
      case "warehouse":
        return [
          { name: "Home", href: "/warehouse", icon: Home },
          { name: "Scan Packages", href: "/warehouse/scan", icon: ScanLine },
          { name: "Upcoming Pickups", href: "/warehouse/pickups", icon: Clock },
          { name: "Inventory Status", href: "/warehouse/inventory", icon: Layers },
          { name: "Settings", href: "/warehouse/settings", icon: Settings },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems(userRole)

  // If no user role, don't show the sidebar
  if (!userRole) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <Image
                src="/msm-courier-logo.jpg"
                alt="MSM Courier Logo"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <span className="text-xs font-semibold text-gray-600">MSM</span>
                <span className="text-sm font-bold text-red-600">COURIER</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="px-3 py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px]">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
