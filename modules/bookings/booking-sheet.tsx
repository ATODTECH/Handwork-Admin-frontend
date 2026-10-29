"use client"

import BookingStatusBadge from "@/components/account/bookings/booking-status-badge"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { DetailRow, DetailSection } from "@/components/shared/details-part"
import { Button } from "@/components/ui/button"
import { artisanEarnings } from "@/lib/bookings"
import { formatActivityDate, formatNairaAmount, formatSchedule } from "@/lib/format"
import type { BookingForStaff, BookingPerson } from "@/types/admin/bookings"
import { bookingAmount, bookingServices } from "./columns"

const Person = ({ title, person }: { title: string, person: BookingPerson | null }) => (
  <DetailSection title={title}>
    <DetailRow label="Name">{person?.name}</DetailRow>
    <DetailRow label="Email">{person?.email}</DetailRow>
    <DetailRow label="Phone">{person?.contact}</DetailRow>
  </DetailSection>
)

const Note = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <DetailSection title={title}>
    <p className="text-[13px] leading-relaxed whitespace-pre-line text-[#626773]">{children}</p>
  </DetailSection>
)

interface BookingSheetProps {
  booking: BookingForStaff | null
  onOpenChange: (open: boolean) => void
  onResolve: (booking: BookingForStaff) => void
}

/** One booking from start to finish, for staff following it up or settling a problem */
const BookingSheet = ({ booking, onOpenChange, onResolve }: BookingSheetProps) => (
  <DetailSheet open={booking !== null} onOpenChange={onOpenChange} title="Booking">
    {booking && (
      <div className="divide-y divide-hw-grey-200">
        <div className="flex flex-wrap items-start justify-between gap-3 pb-5">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-lg font-semibold text-hw-grey-900">{bookingServices(booking)}</span>
            <span className="text-xs text-hw-grey-500">#{booking.id}</span>
          </div>
          <BookingStatusBadge status={booking.status} viewer="staff" />
        </div>

        {booking.dispute_reason && <Note title="Problem reported">{booking.dispute_reason}</Note>}
        {booking.resolution_note && <Note title={`Settled by ${booking.resolved_by ?? "staff"}`}>{booking.resolution_note}</Note>}
        {booking.cancellation_reason && <Note title="Why it was cancelled">{booking.cancellation_reason}</Note>}

        <Note title="What the customer asked for">{booking.description || "No details given."}</Note>

        <DetailSection title="Money">
          <DetailRow label="Budget">{formatNairaAmount(booking.budget)}</DetailRow>
          <DetailRow label="Artisan's price">{booking.agreed_amount && formatNairaAmount(booking.agreed_amount)}</DetailRow>
          {booking.agreed_amount && <DetailRow label="Artisan receives">{formatNairaAmount(artisanEarnings(bookingAmount(booking)))}</DetailRow>}
          <DetailRow label="Paystack reference">{booking.payment_reference || null}</DetailRow>
        </DetailSection>

        <DetailSection title="When and where">
          <DetailRow label="Job date">{formatSchedule(booking.scheduled_date, booking.scheduled_time)}</DetailRow>
          <DetailRow label="Address">{booking.address}</DetailRow>
        </DetailSection>

        <Person title="Customer" person={booking.client} />
        <Person title="Artisan" person={booking.artisan} />

        <DetailSection title="Timeline">
          <DetailRow label="Booked">{formatActivityDate(booking.created_at)}</DetailRow>
          {booking.fully_paid_at && <DetailRow label="Paid">{formatActivityDate(booking.fully_paid_at)}</DetailRow>}
          {booking.completed_at && <DetailRow label="Marked done">{formatActivityDate(booking.completed_at)}</DetailRow>}
          {booking.disputed_at && <DetailRow label="Problem reported">{formatActivityDate(booking.disputed_at)}</DetailRow>}
          {booking.resolved_at && <DetailRow label="Settled">{formatActivityDate(booking.resolved_at)}</DetailRow>}
          {booking.released_at && <DetailRow label="Artisan paid">{formatActivityDate(booking.released_at)}</DetailRow>}
          {booking.cancelled_at && <DetailRow label="Cancelled">{formatActivityDate(booking.cancelled_at)}</DetailRow>}
        </DetailSection>

        {booking.status === "Disputed" && (
          <div className="pt-5">
            <Button className="w-full" onClick={() => onResolve(booking)}>
              Settle the problem
            </Button>
          </div>
        )}
      </div>
    )}
  </DetailSheet>
)

export default BookingSheet
