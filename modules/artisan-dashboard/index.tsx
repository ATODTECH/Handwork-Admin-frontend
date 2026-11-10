"use client"

import {
  BriefcaseBusiness,
  CalendarDays,
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
import { ACCOUNT_ROUTES } from "@/lib/routes"

const artisanNav = (unread: number): DashboardNavGroup[] => [
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
      { title: "Reviews", href: "#", icon: Star, soon: true },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile & settings", href: ACCOUNT_ROUTES.artisanSettings, icon: UserRoundCog },
      { title: "Help & support", href: "/contact", icon: LifeBuoy },
    ],
  },
]

export const ArtisanShell = ({ children }: { children: React.ReactNode }) => {
  const unread = useUnreadMessages()
  return <DashboardShell nav={artisanNav(unread)}>{children}</DashboardShell>
}

export { default as ArtisanOverview } from "./overview"
export { default as ArtisanOnboarding } from "./onboarding"
