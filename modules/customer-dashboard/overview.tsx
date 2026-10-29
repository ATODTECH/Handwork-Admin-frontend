"use client"

import Link from "next/link"
import { ArrowRight, CalendarClock, CircleCheckBig, Search, Wallet, WalletCards } from "lucide-react"
import BookingList from "@/components/account/bookings/booking-list"
import NotificationList from "@/components/account/notification-list"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import StatCard from "@/components/account/stat-card"
import { Button } from "@/components/ui/button"
import { useMyBookings } from "@/hooks/account/use-dashboard"
import { useAccountProfile } from "@/hooks/site/use-auth"
import { nextBooking, sortByRecent, summarizeBookings } from "@/lib/bookings"
import { formatNairaAmount } from "@/lib/format"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import CategoryGrid from "./category-grid"
import NextBookingCard from "./next-booking-card"
import NoBookingsYet from "./no-bookings-yet"
import PaySafelyCard from "./pay-safely-card"

const RECENT_LIMIT = 4

const greeting = (hour: number) => (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening")

const ViewAllLink = ({ href, label = "View all" }: { href: string, label?: string }) => (
  <Button variant="link" size="sm" className="h-auto px-0" render={<Link href={href} />} nativeButton={false}>
    {label}
    <ArrowRight data-icon="inline-end" />
  </Button>
)

const CustomerOverview = () => {
  const { data: bookings = [], isPending, isError, refetch } = useMyBookings()
  const stats = summarizeBookings(bookings)
  const upNext = nextBooking(bookings)
  const recent = sortByRecent(bookings).slice(0, RECENT_LIMIT)
  // Null until hydrated, so the time-of-day greeting never mismatches the server render
  const profile = useAccountProfile()
  const firstName = profile?.name.split(" ")[0]
  const title = profile ? `${greeting(new Date().getHours())}${firstName ? `, ${firstName}` : ""}` : "Welcome back"

  return (
    <>
      <PageHeader
        title={title}
        description="Book a verified artisan and keep track of every job here."
        actions={
          <Button render={<Link href={ACCOUNT_ROUTES.customerArtisans} />} nativeButton={false}>
            <Search data-icon="inline-start" />
            Find an artisan
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Active bookings" value={stats.active} hint="Requests and jobs in progress" icon={CalendarClock} tone="info" loading={isPending} />
        <StatCard label="Needs your action" value={stats.needsAction} hint="Payments or jobs to confirm" icon={WalletCards} tone="brand" loading={isPending} />
        <StatCard label="Completed jobs" value={stats.completed} hint="Paid in full" icon={CircleCheckBig} tone="success" loading={isPending} />
        <StatCard label="Total spent" value={formatNairaAmount(stats.totalSpent)} hint="Across all bookings" icon={Wallet} tone="warning" loading={isPending} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          {upNext && <NextBookingCard booking={upNext} />}
          <SectionCard title="Recent bookings" description="Your latest requests and jobs." action={<ViewAllLink href={ACCOUNT_ROUTES.customerBookings} />}>
            <QueryContent isPending={isPending} isError={isError} onRetry={refetch} isEmpty={!recent.length} empty={<NoBookingsYet />}>
              <BookingList bookings={recent} />
            </QueryContent>
          </SectionCard>
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <SectionCard title="Notifications" description="Updates on your account and bookings." contentClassName="-mx-2">
            <NotificationList limit={4} />
          </SectionCard>
          <PaySafelyCard />
        </div>
      </div>

      <SectionCard title="Explore categories" description="Skilled professionals for every kind of job." action={<ViewAllLink href={ACCOUNT_ROUTES.customerArtisans} label="See all artisans" />}>
        <CategoryGrid />
      </SectionCard>
    </>
  )
}

export default CustomerOverview
