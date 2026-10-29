"use client"

import { useState } from "react"
import Link from "next/link"
import { CircleCheckBig, CreditCard } from "lucide-react"
import SubmitButton from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useConfirmBooking, usePayBooking } from "@/hooks/account/use-dashboard"
import { autoReleaseAt, bookingMeta, bookingPrice, bookingTitle } from "@/lib/bookings"
import { formatNairaAmount } from "@/lib/format"
import type { Booking } from "@/types/account/dashboard"

const RELEASE_DATE = new Intl.DateTimeFormat("en-NG", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })

const ConfirmDialog = ({ booking, open, onOpenChange }: { booking: Booking, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { mutate, isPending } = useConfirmBooking()
  const releaseAt = autoReleaseAt(booking)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Is the job done?</DialogTitle>
          <DialogDescription>
            {booking.artisan} has marked &ldquo;{bookingTitle(booking)}&rdquo; as done. Confirming pays them from the{" "}
            {formatNairaAmount(bookingPrice(booking))} you paid. You can&apos;t undo this.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm leading-relaxed text-hw-grey-700">
          Something wrong? <Link href="/contact" className="font-medium text-hw-primary underline-offset-4 hover:underline">Contact support</Link>
          {releaseAt ? ` before ${RELEASE_DATE.format(releaseAt)}` : ""}, and we&apos;ll hold the payment while we sort it out.
          Otherwise we pay the artisan automatically then.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Not yet
          </Button>
          <SubmitButton
            type="button"
            size="default"
            pending={isPending}
            pendingText="Confirming…"
            onClick={() => mutate(booking.id, { onSuccess: () => onOpenChange(false) })}
          >
            Yes, it&apos;s done
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** What the customer can do with a booking right now: pay for it, or confirm the job is done */
const BookingActions = ({ booking, className }: { booking: Booking, className?: string }) => {
  const { action } = bookingMeta(booking.status)
  const pay = usePayBooking()
  const [confirming, setConfirming] = useState(false)

  if (action === "pay") {
    return (
      <SubmitButton
        type="button"
        size="sm"
        pending={pay.isPending}
        pendingText="Opening payment…"
        onClick={() => pay.mutate(booking.id)}
        className={className}
      >
        <CreditCard data-icon="inline-start" />
        Pay {formatNairaAmount(bookingPrice(booking))}
      </SubmitButton>
    )
  }

  if (action === "confirm") {
    return (
      <>
        <Button size="sm" onClick={() => setConfirming(true)} className={className}>
          <CircleCheckBig data-icon="inline-start" />
          Confirm job done
        </Button>
        <ConfirmDialog booking={booking} open={confirming} onOpenChange={setConfirming} />
      </>
    )
  }

  return null
}

export default BookingActions
