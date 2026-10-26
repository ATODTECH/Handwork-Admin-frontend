"use client"

import { CreditCard } from "lucide-react"
import SubmitButton from "@/components/form/submit-button"
import { usePayBooking } from "@/hooks/account/use-dashboard"
import { bookingAmountDue, bookingMeta } from "@/lib/bookings"
import { formatNairaAmount } from "@/lib/format"
import type { Booking } from "@/types/account/dashboard"

/** Deposit or balance payment for a booking; renders nothing when nothing is due */
const PayBookingButton = ({ booking, className }: { booking: Booking, className?: string }) => {
  const { payment } = bookingMeta(booking.status)
  const { mutate: pay, isPending } = usePayBooking()
  if (!payment) return null

  return (
    <SubmitButton
      type="button"
      size="sm"
      pending={isPending}
      pendingText="Opening checkout…"
      onClick={() => pay({ bookingId: booking.id, kind: payment })}
      className={className}
    >
      <CreditCard data-icon="inline-start" />
      Pay {payment} · {formatNairaAmount(bookingAmountDue(booking))}
    </SubmitButton>
  )
}

export default PayBookingButton
