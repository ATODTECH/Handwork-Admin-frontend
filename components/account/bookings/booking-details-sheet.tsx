"use client"

import { Phone } from "lucide-react"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { DetailRow, DetailSection } from "@/components/shared/details-part"
import { artisanEarnings, bookingMeta, bookingPrice, bookingTitle, jobMeta, priceAboveBudget } from "@/lib/bookings"
import { formatActivityDate, formatNairaAmount, formatSchedule } from "@/lib/format"
import type { Booking } from "@/types/account/dashboard"
import BookingActions from "./booking-actions"
import BookingProgress from "./booking-progress"
import BookingStatusBadge, { type BookingViewer } from "./booking-status-badge"
import JobActions, { JobRequest } from "./job-actions"

interface BookingDetailsSheetProps {
  booking: Booking | null
  viewer: BookingViewer
  onOpenChange: (open: boolean) => void
}

/** A note from one side or from our team (why it was cancelled, the problem reported, how we settled it) */
const Note = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <DetailSection title={title}>
    <p className="text-[13px] leading-relaxed whitespace-pre-line text-[#626773]">{children}</p>
  </DetailSection>
)

/** Everything about one booking, for the customer or the artisan, with what they can do next */
const BookingDetailsSheet = ({ booking, viewer, onOpenChange }: BookingDetailsSheetProps) => {
  const isArtisan = viewer === "artisan"

  return (
    <DetailSheet open={booking !== null} onOpenChange={onOpenChange} title="Booking">
      {booking && (
        <div className="divide-y divide-hw-grey-200">
          <div className="flex flex-col gap-3 pb-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-hw-grey-900">{bookingTitle(booking)}</h3>
              <BookingStatusBadge status={booking.status} viewer={viewer} />
            </div>
            <p className="text-sm text-hw-grey-700">{(isArtisan ? jobMeta(booking.status) : bookingMeta(booking.status)).hint}</p>
            {!isArtisan && <BookingProgress status={booking.status} />}
          </div>

          <div className="py-5">
            <JobRequest booking={booking} />
          </div>

          <DetailSection title="Price">
            <DetailRow label={isArtisan ? "Their budget" : "Your budget"}>{formatNairaAmount(booking.budget)}</DetailRow>
            {booking.agreed_amount && (
              <DetailRow label={isArtisan ? "Your price" : "Artisan's price"}>
                {formatNairaAmount(booking.agreed_amount)}
                {priceAboveBudget(booking) > 0 && ` (${formatNairaAmount(priceAboveBudget(booking))} above budget)`}
              </DetailRow>
            )}
            {isArtisan && booking.agreed_amount && (
              <DetailRow label="You receive">{formatNairaAmount(artisanEarnings(bookingPrice(booking)))}</DetailRow>
            )}
          </DetailSection>

          <DetailSection title="When and where">
            <DetailRow label="Date">{formatSchedule(booking.scheduled_date, booking.scheduled_time)}</DetailRow>
            <DetailRow label="Address">{booking.address}</DetailRow>
            <DetailRow label="Requested">{formatActivityDate(booking.created_at)}</DetailRow>
          </DetailSection>

          <DetailSection title={isArtisan ? "Customer" : "Artisan"}>
            <DetailRow label="Name">{isArtisan ? booking.client : booking.artisan}</DetailRow>
            {booking.contact ? (
              <DetailRow label="Phone">
                <a href={`tel:${booking.contact}`} className="inline-flex items-center gap-1 font-medium text-hw-secondary">
                  <Phone className="size-3" />
                  {booking.contact}
                </a>
              </DetailRow>
            ) : (
              <p className="pt-1 text-xs text-hw-grey-500">Phone numbers are shared once the job is paid for.</p>
            )}
          </DetailSection>

          {booking.cancellation_reason && <Note title="Why it was cancelled">{booking.cancellation_reason}</Note>}
          {booking.dispute_reason && <Note title="Problem reported">{booking.dispute_reason}</Note>}
          {booking.resolution_note && <Note title="How our team settled it">{booking.resolution_note}</Note>}

          <div className="flex justify-end pt-5 empty:hidden">
            {isArtisan ? <JobActions booking={booking} /> : <BookingActions booking={booking} expanded />}
          </div>
        </div>
      )}
    </DetailSheet>
  )
}

export default BookingDetailsSheet
