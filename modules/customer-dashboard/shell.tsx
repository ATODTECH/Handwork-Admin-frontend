"use client"

import { CalendarCheck, CreditCard, Gift, LayoutDashboard, LifeBuoy, MessageSquareText, Search, UserRoundCog } from "lucide-react"
import DashboardShell from "@/components/account/dashboard-shell"
import type { DashboardNavGroup } from "@/components/account/nav"
import { useUnreadMessages } from "@/hooks/account/use-messages"
import { ACCOUNT_ROUTES } from "@/lib/routes"

const customerNav = (unread: number): DashboardNavGroup[] => [
  {
    label: "Menu",
    items: [
      { title: "Overview", href: ACCOUNT_ROUTES.customerHome, icon: LayoutDashboard, exact: true },
      { title: "My bookings", href: ACCOUNT_ROUTES.customerBookings, icon: CalendarCheck },
      { title: "Find an artisan", href: ACCOUNT_ROUTES.customerArtisans, icon: Search },
      { title: "Messages", href: ACCOUNT_ROUTES.customerMessages, icon: MessageSquareText, badge: unread },
      { title: "Payments", href: "#", icon: CreditCard, soon: true },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Refer & earn", href: "#", icon: Gift, soon: true },
      { title: "Profile & settings", href: ACCOUNT_ROUTES.customerSettings, icon: UserRoundCog },
      { title: "Help & support", href: "/contact", icon: LifeBuoy },
    ],
  },
]

const CustomerShell = ({ children }: { children: React.ReactNode }) => {
  const unread = useUnreadMessages()
  return <DashboardShell nav={customerNav(unread)}>{children}</DashboardShell>
}

export default CustomerShell
