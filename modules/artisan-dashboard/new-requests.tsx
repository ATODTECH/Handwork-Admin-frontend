"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import BookingList from "@/components/account/bookings/booking-list"
import SectionCard from "@/components/account/section-card"
import { Button } from "@/components/ui/button"
import { useMyBookings } from "@/hooks/account/use-dashboard"
import { filterJobs, sortByRecent } from "@/lib/bookings"
import { ACCOUNT_ROUTES } from "@/lib/routes"

const LIMIT = 3

/** Requests waiting for the artisan's answer, on the overview; hidden when there are none */
const NewRequests = () => {
  const { data = [] } = useMyBookings()
  const requests = sortByRecent(filterJobs(data, "new"))
  if (!requests.length) return null

  return (
    <SectionCard
      title={requests.length === 1 ? "1 new job request" : `${requests.length} new job requests`}
      description="Accept with your price, or decline so the customer can book someone else."
      action={
        <Button variant="link" size="sm" className="h-auto px-0" render={<Link href={ACCOUNT_ROUTES.artisanJobs} />} nativeButton={false}>
          All jobs
          <ArrowRight data-icon="inline-end" />
        </Button>
      }
    >
      <BookingList bookings={requests.slice(0, LIMIT)} viewer="artisan" />
    </SectionCard>
  )
}

export default NewRequests
