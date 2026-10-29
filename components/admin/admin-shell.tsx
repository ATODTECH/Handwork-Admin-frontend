"use client"

import Link from "next/link"
import {
  BellRing,
  BookOpenCheck,
  ChartColumn,
  ChevronDown,
  Globe,
  Headset,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  UserRoundCheck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react"
import DashboardShell from "@/components/account/dashboard-shell"
import type { DashboardNavGroup } from "@/components/account/nav"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAdminSignOut } from "@/hooks/admin/use-admin-auth"
import { ROUTES } from "@/lib/routes"

const ADMIN_NAV: DashboardNavGroup[] = [
  {
    label: "Manage",
    items: [
      { title: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
      { title: "Artisans", href: ROUTES.artisans, icon: UserRoundCheck },
      { title: "Payouts", href: ROUTES.payouts, icon: Wallet },
      { title: "User management", href: ROUTES.users, icon: Users },
      { title: "Bookings", href: ROUTES.bookings, icon: BookOpenCheck, soon: true },
      { title: "Services", href: ROUTES.services, icon: Wrench, soon: true },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Reports", href: ROUTES.reports, icon: ChartColumn, soon: true },
      { title: "Support", href: ROUTES.support, icon: Headset, soon: true },
      { title: "Notifications", href: ROUTES.notifications, icon: BellRing, soon: true },
      { title: "Settings", href: ROUTES.settings, icon: Settings, soon: true },
    ],
  },
]

/** Staff menu in the header: the admin session is separate from customer/artisan accounts */
const AdminMenu = () => {
  const signOut = useAdminSignOut()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-10 gap-2 rounded-full px-1.5 sm:pr-3" />}>
        <Avatar className="size-8">
          <AvatarFallback className="bg-secondary-blue text-white">
            <ShieldCheck className="size-4" />
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium text-hw-grey-900 sm:inline">Staff</span>
        <ChevronDown className="hidden size-4 text-hw-grey-500 sm:inline" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm font-semibold text-hw-grey-900">Admin console</span>
            <span className="text-xs font-normal text-hw-grey-500">Handwork Expert staff</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/" />}>
          <Globe />
          Back to website
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={signOut}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** The admin console in the same frame as the customer and artisan dashboards */
const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const signOut = useAdminSignOut()
  return (
    <DashboardShell nav={ADMIN_NAV} headerActions={<AdminMenu />} onSignOut={signOut} showSupport={false}>
      {children}
    </DashboardShell>
  )
}

export default AdminShell
