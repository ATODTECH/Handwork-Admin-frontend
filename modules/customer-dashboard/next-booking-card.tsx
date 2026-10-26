import Link from "next/link"
import { ArrowRight } from "lucide-react"
import BookingProgress from "@/components/account/bookings/booking-progress"
import BookingStatusBadge from "@/components/account/bookings/booking-status-badge"
import { BookingFacts } from "@/components/account/bookings/booking-list"
import PayBookingButton from "@/components/account/bookings/pay-booking-button"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { bookingMeta, bookingPrice, bookingTitle } from "@/lib/bookings"
import { formatNairaAmount } from "@/lib/format"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import type { Booking } from "@/types/account/dashboard"

/** The booking that needs attention now, with where it is in the process */
const NextBookingCard = ({ booking }: { booking: Booking }) => {
  const { hint } = bookingMeta(booking.status)

  return (
    <Card className="relative gap-6 overflow-hidden rounded-2xl p-6 shadow-none ring-hw-border">
      <span className="absolute inset-y-0 left-0 w-1 bg-hw-primary" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-hw-primary uppercase">Up next</span>
          <h2 className="text-lg font-semibold text-hw-grey-900">{bookingTitle(booking)}</h2>
          <BookingFacts booking={booking} />
        </div>
        <div className="flex flex-row-reverse items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
          <BookingStatusBadge status={booking.status} />
          <span className="text-xl font-semibold text-hw-grey-900 tabular-nums">{formatNairaAmount(bookingPrice(booking))}</span>
        </div>
      </div>
      <BookingProgress status={booking.status} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-hw-grey-200/30 px-4 py-3">
        <p className="text-sm text-hw-grey-700">{hint}</p>
        <div className="flex items-center gap-2">
          <PayBookingButton booking={booking} />
          <Button variant="ghost" size="sm" render={<Link href={ACCOUNT_ROUTES.customerBookings} />} nativeButton={false}>
            All bookings
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default NextBookingCard
