"use client"

import Link from "next/link"
import { ArrowRight, CalendarClock, CircleCheckBig, Wallet, WalletCards } from "lucide-react"
import BookingList from "@/components/account/bookings/booking-list"
import NotificationList from "@/components/account/notification-list"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import StatCard from "@/components/account/stat-card"
import { Button } from "@/components/ui/button"
import { useMyBookings } from "@/hooks/account/use-dashboard"
import { nextBooking, sortByRecent, summarizeBookings } from "@/lib/bookings"
import { formatNairaAmount } from "@/lib/format"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import CategoryGrid from "./category-grid"
import NextBookingCard from "./next-booking-card"
import NoBookingsYet from "./no-bookings-yet"
import PaySafelyCard from "./pay-safely-card"
import WelcomeBanner from "./welcome-banner"

const RECENT_LIMIT = 4

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

  return (
    <>
      <WelcomeBanner />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Active bookings" value={stats.active} hint="Requests and jobs in progress" icon={CalendarClock} tone="info" loading={isPending} />
        <StatCard label="Awaiting payment" value={stats.awaitingPayment} hint="Deposits or balances due" icon={WalletCards} tone="brand" loading={isPending} />
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

      <SectionCard title="Explore categories" description="Skilled professionals for every kind of job." action={<ViewAllLink href="/categories" label="See all" />}>
        <CategoryGrid />
      </SectionCard>
    </>
  )
}

export default CustomerOverview
