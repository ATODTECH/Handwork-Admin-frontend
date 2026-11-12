"use client"

import {
  BriefcaseBusiness,
  CalendarDays,
  Gift,
  LayoutDashboard,
  LifeBuoy,
  MessageSquareText,
  Search,
  Send,
  Star,
  UserRoundCog,
  Wallet,
} from "lucide-react"
import DashboardShell from "@/components/account/dashboard-shell"
import type { DashboardNavGroup } from "@/components/account/nav"
import { useUnreadMessages } from "@/hooks/account/use-messages"
import { useUnreadTickets } from "@/hooks/account/use-support"
import { ACCOUNT_ROUTES } from "@/lib/routes"

const artisanNav = (unread: number, supportUnread: number): DashboardNavGroup[] => [
  {
    label: "Menu",
    items: [
      { title: "Overview", href: ACCOUNT_ROUTES.artisanHome, icon: LayoutDashboard, exact: true },
      { title: "Find work", href: ACCOUNT_ROUTES.artisanFindWork, icon: Search },
      { title: "My offers", href: ACCOUNT_ROUTES.artisanOffers, icon: Send },
      { title: "Job requests", href: ACCOUNT_ROUTES.artisanJobs, icon: BriefcaseBusiness },
      { title: "Messages", href: ACCOUNT_ROUTES.artisanMessages, icon: MessageSquareText, badge: unread },
      { title: "Schedule", href: ACCOUNT_ROUTES.artisanSchedule, icon: CalendarDays },
      { title: "Earnings", href: ACCOUNT_ROUTES.artisanEarnings, icon: Wallet },
      { title: "Reviews", href: ACCOUNT_ROUTES.artisanReviews, icon: Star },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Refer & earn", href: ACCOUNT_ROUTES.artisanRefer, icon: Gift },
      { title: "Profile & settings", href: ACCOUNT_ROUTES.artisanSettings, icon: UserRoundCog },
      { title: "Help & support", href: ACCOUNT_ROUTES.artisanSupport, icon: LifeBuoy, badge: supportUnread, badgeLabel: "New replies" },
    ],
  },
]

export const ArtisanShell = ({ children }: { children: React.ReactNode }) => {
  const unread = useUnreadMessages()
  const supportUnread = useUnreadTickets()
  return (
    <DashboardShell nav={artisanNav(unread, supportUnread)} supportHref={ACCOUNT_ROUTES.artisanSupport}>
      {children}
    </DashboardShell>
  )
}

export { default as ArtisanOverview } from "./overview"
export { default as ArtisanOnboarding } from "./onboarding"
