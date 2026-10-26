"use client"

import {
  BriefcaseBusiness,
  CalendarDays,
  FileCheck2,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  Star,
  Wallet,
  Wrench,
} from "lucide-react"
import DashboardShell from "@/components/account/dashboard-shell"
import EmptyState from "@/components/account/empty-state"
import type { DashboardNavGroup } from "@/components/account/nav"
import PageHeader from "@/components/account/page-header"
import SectionCard from "@/components/account/section-card"
import StepList, { type Step } from "@/components/account/step-list"
import { ACCOUNT_ROUTES } from "@/lib/routes"

const ARTISAN_NAV: DashboardNavGroup[] = [
  {
    label: "Menu",
    items: [
      { title: "Overview", href: ACCOUNT_ROUTES.artisanHome, icon: LayoutDashboard, exact: true },
      { title: "Job requests", href: "#", icon: BriefcaseBusiness, soon: true },
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

// TODO: the artisan dashboard (job requests, today's schedule, earnings), as in the mobile app
export const ArtisanOverview = () => (
  <>
    <PageHeader title="Artisan dashboard" description="Your jobs, schedule and earnings in one place." />
    <EmptyState
      icon={BriefcaseBusiness}
      title="Your artisan dashboard is on its way"
      description="New job requests, today's schedule and your earnings will appear here."
    />
  </>
)

const ONBOARDING_STEPS: Step[] = [
  { icon: FileCheck2, title: "Upload your ID", text: "Your NIN, BVN and a driver's licence, passport or NIN slip." },
  { icon: Wrench, title: "Add your services", text: "What you do, your price range and photos of past work." },
  { icon: Landmark, title: "Add bank details", text: "Where we send your earnings after each job." },
]

// TODO: the 3 onboarding forms, as in the mobile app
export const ArtisanOnboarding = () => (
  <>
    <PageHeader title="Finish setting up" description="Three quick steps before you can start getting jobs." />
    <SectionCard title="Your setup checklist" className="max-w-2xl">
      <StepList steps={ONBOARDING_STEPS} />
    </SectionCard>
  </>
)
