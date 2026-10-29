"use client"

import Link from "next/link"
import { BriefcaseBusiness, CircleCheckBig, Clock, Wallet, WalletCards } from "lucide-react"
import BookingList from "@/components/account/bookings/booking-list"
import EmptyState from "@/components/account/empty-state"
import NotificationList from "@/components/account/notification-list"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import StatCard from "@/components/account/stat-card"
import ViewAllLink from "@/components/account/view-all-link"
import { Button } from "@/components/ui/button"
import { useMyBookings } from "@/hooks/account/use-dashboard"
import { useGreeting } from "@/hooks/account/use-greeting"
import { useWallet } from "@/hooks/account/use-wallet"
import { filterJobs, RELEASE_AFTER_HOURS, sortBySchedule } from "@/lib/bookings"
import { formatNairaAmount } from "@/lib/format"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import LocationPrompt from "./location-prompt"
import NewRequests from "./new-requests"
import VerificationStatus from "./verification-status"

const UPCOMING_LIMIT = 4

/** The artisan's home: what needs doing, what's coming up, and what they've earned */
const ArtisanOverview = () => {
  const title = useGreeting()
  const jobs = useMyBookings()
  const wallet = useWallet()
  const active = filterJobs(jobs.data ?? [], "active")
  const upcoming = sortBySchedule(active).slice(0, UPCOMING_LIMIT)
  const completed = filterJobs(jobs.data ?? [], "done").length

  return (
    <>
      <PageHeader
        title={title}
        description="Your jobs and earnings in one place."
        actions={
          <Button render={<Link href={ACCOUNT_ROUTES.artisanEarnings} />} nativeButton={false}>
            <WalletCards data-icon="inline-start" />
            Earnings
          </Button>
        }
      />
      <LocationPrompt />
      <VerificationStatus />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Available"
          value={wallet.data && formatNairaAmount(wallet.data.available)}
          hint="Ready to withdraw"
          icon={Wallet}
          tone="success"
          loading={wallet.isPending}
        />
        <StatCard
          label="On the way"
          value={wallet.data && formatNairaAmount(wallet.data.on_the_way)}
          hint={`Paid by customers; yours when they confirm or after ${RELEASE_AFTER_HOURS} hours`}
          icon={Clock}
          tone="info"
          loading={wallet.isPending}
        />
        <StatCard label="Active jobs" value={active.length} hint="Accepted and not yet paid out" icon={BriefcaseBusiness} tone="brand" loading={jobs.isPending} />
        <StatCard label="Completed jobs" value={completed} hint="Confirmed and paid" icon={CircleCheckBig} tone="warning" loading={jobs.isPending} />
      </div>

      <NewRequests />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Upcoming jobs"
          description="Accepted jobs, soonest first."
          action={<ViewAllLink href={ACCOUNT_ROUTES.artisanJobs} label="All jobs" />}
          className="min-w-0 lg:col-span-2"
        >
          <QueryContent
            isPending={jobs.isPending}
            isError={jobs.isError}
            onRetry={jobs.refetch}
            isEmpty={!upcoming.length}
            empty={
              <EmptyState
                icon={BriefcaseBusiness}
                title="No upcoming jobs"
                description="When you accept a request and the customer pays, the job shows up here."
              />
            }
          >
            <BookingList bookings={upcoming} viewer="artisan" />
          </QueryContent>
        </SectionCard>
        <SectionCard title="Notifications" description="Updates on your jobs and payouts." className="min-w-0" contentClassName="-mx-2">
          <NotificationList limit={5} />
        </SectionCard>
      </div>
    </>
  )
}

export default ArtisanOverview
