"use client"

import { CalendarCheck, ClipboardList, CreditCard, Gift, LayoutDashboard, LifeBuoy, MessageSquareText, Search, UserRoundCog } from "lucide-react"
import DashboardShell from "@/components/account/dashboard-shell"
import type { DashboardNavGroup } from "@/components/account/nav"
import { useUnreadMessages } from "@/hooks/account/use-messages"
import { useUnreadTickets } from "@/hooks/account/use-support"
import { ACCOUNT_ROUTES } from "@/lib/routes"

const customerNav = (unread: number, supportUnread: number): DashboardNavGroup[] => [
  {
    label: "Menu",
    items: [
      { title: "Overview", href: ACCOUNT_ROUTES.customerHome, icon: LayoutDashboard, exact: true },
      { title: "My requests", href: ACCOUNT_ROUTES.customerRequests, icon: ClipboardList },
      { title: "My bookings", href: ACCOUNT_ROUTES.customerBookings, icon: CalendarCheck },
      { title: "Find an artisan", href: ACCOUNT_ROUTES.customerArtisans, icon: Search },
      { title: "Messages", href: ACCOUNT_ROUTES.customerMessages, icon: MessageSquareText, badge: unread },
      { title: "Payments", href: ACCOUNT_ROUTES.customerPayments, icon: CreditCard },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Refer & earn", href: "#", icon: Gift, soon: true },
      { title: "Profile & settings", href: ACCOUNT_ROUTES.customerSettings, icon: UserRoundCog },
      { title: "Help & support", href: ACCOUNT_ROUTES.customerSupport, icon: LifeBuoy, badge: supportUnread, badgeLabel: "New replies" },
    ],
  },
]

const CustomerShell = ({ children }: { children: React.ReactNode }) => {
  const unread = useUnreadMessages()
  const supportUnread = useUnreadTickets()
  return (
    <DashboardShell nav={customerNav(unread, supportUnread)} supportHref={ACCOUNT_ROUTES.customerSupport}>
      {children}
    </DashboardShell>
  )
}

export default CustomerShell
