"use client"

import { CalendarDays } from "lucide-react"
import BookingList from "@/components/account/bookings/booking-list"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { useMyBookings } from "@/hooks/account/use-dashboard"
import { scheduleDays } from "@/lib/bookings"
import { dayKey } from "@/lib/format"

/** The artisan's accepted jobs that aren't finished yet, by day */
const ArtisanSchedule = () => {
  const { data = [], isPending, isError, refetch } = useMyBookings()
  const days = scheduleDays(data, dayKey(new Date().toISOString()))

  return (
    <>
      <PageHeader title="Schedule" description="Your upcoming jobs by day. New requests appear here once you accept them." />
      <QueryContent
        isPending={isPending}
        isError={isError}
        onRetry={refetch}
        isEmpty={!days.length}
        empty={
          <SectionCard title="Upcoming jobs">
            <EmptyState icon={CalendarDays} title="Nothing scheduled" description="Jobs appear here once you accept a request." />
          </SectionCard>
        }
      >
        <div className="flex flex-col gap-6">
          {days.map(({ key, title, bookings }) => (
            <SectionCard key={key} title={title}>
              <BookingList bookings={bookings} viewer="artisan" />
            </SectionCard>
          ))}
        </div>
      </QueryContent>
    </>
  )
}

export default ArtisanSchedule
