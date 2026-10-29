"use client"

import {
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  LifeBuoy,
  Star,
  Wallet,
} from "lucide-react"
import DashboardShell from "@/components/account/dashboard-shell"
import type { DashboardNavGroup } from "@/components/account/nav"
import { ACCOUNT_ROUTES } from "@/lib/routes"

const ARTISAN_NAV: DashboardNavGroup[] = [
  {
    label: "Menu",
    items: [
      { title: "Overview", href: ACCOUNT_ROUTES.artisanHome, icon: LayoutDashboard, exact: true },
      { title: "Job requests", href: ACCOUNT_ROUTES.artisanJobs, icon: BriefcaseBusiness },
      { title: "Schedule", href: "#", icon: CalendarDays, soon: true },
      { title: "Earnings", href: ACCOUNT_ROUTES.artisanEarnings, icon: Wallet },
      { title: "Reviews", href: "#", icon: Star, soon: true },
    ],
  },
  {
    label: "Account",
    items: [{ title: "Help & support", href: "/contact", icon: LifeBuoy }],
  },
]

export const ArtisanShell = ({ children }: { children: React.ReactNode }) => <DashboardShell nav={ARTISAN_NAV}>{children}</DashboardShell>

export { default as ArtisanOverview } from "./overview"
export { default as ArtisanOnboarding } from "./onboarding"
