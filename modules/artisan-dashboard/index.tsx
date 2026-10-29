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
import EmptyState from "@/components/account/empty-state"
import type { DashboardNavGroup } from "@/components/account/nav"
import PageHeader from "@/components/account/page-header"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import LocationPrompt from "./location-prompt"
import NewRequests from "./new-requests"
import VerificationStatus from "./verification-status"

const ARTISAN_NAV: DashboardNavGroup[] = [
  {
    label: "Menu",
    items: [
      { title: "Overview", href: ACCOUNT_ROUTES.artisanHome, icon: LayoutDashboard, exact: true },
      { title: "Job requests", href: ACCOUNT_ROUTES.artisanJobs, icon: BriefcaseBusiness },
      { title: "Schedule", href: "#", icon: CalendarDays, soon: true },
      { title: "Earnings", href: "#", icon: Wallet, soon: true },
      { title: "Reviews", href: "#", icon: Star, soon: true },
    ],
  },
  {
    label: "Account",
    items: [{ title: "Help & support", href: "/contact", icon: LifeBuoy }],
  },
]

export const ArtisanShell = ({ children }: { children: React.ReactNode }) => <DashboardShell nav={ARTISAN_NAV}>{children}</DashboardShell>

// TODO: today's schedule and earnings, as in the mobile app
export const ArtisanOverview = () => (
  <>
    <PageHeader title="Artisan dashboard" description="Your jobs, schedule and earnings in one place." />
    <LocationPrompt />
    <VerificationStatus />
    <NewRequests />
    <EmptyState
      icon={BriefcaseBusiness}
      title="Your schedule and earnings are on their way"
      description="New job requests are under Job requests. Today's schedule and your earnings will appear here soon."
    />
  </>
)

export { default as ArtisanOnboarding } from "./onboarding"
