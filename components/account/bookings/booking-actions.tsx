"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "cn"
import { CircleAlert, CircleCheckBig, CreditCard, X } from "lucide-react"
import SubmitButton from "@/components/form/submit-button"
import ReasonDialog from "@/components/shared/reason-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCancelBooking, useConfirmBooking, usePayBooking, useReportProblem } from "@/hooks/account/use-dashboard"
import { autoReleaseAt, bookingMeta, bookingPrice, bookingTitle, CANCELLABLE, REPORTABLE } from "@/lib/bookings"
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
          Something wrong? Choose <strong className="font-medium text-hw-grey-900">Report a problem</strong>
          {releaseAt ? ` before ${RELEASE_DATE.format(releaseAt)}` : ""}, and we&apos;ll hold the payment while we sort it out.
          Otherwise we pay the artisan automatically then. You can also{" "}
          <Link href="/contact" className="font-medium text-hw-primary underline-offset-4 hover:underline">contact support</Link>.
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

const CANCEL_REASONS = ["The price is more than I can pay", "I found someone else", "I no longer need this done", "I need a different date"]

const REPORT_REASONS = [
  "The artisan didn't show up",
  "The job isn't finished",
  "The work is poor quality",
  "The artisan asked for more money",
]

/** Cancel before paying. Once the artisan has set a price, cancelling is how the customer turns it down */
const CancelDialog = ({ booking, open, onOpenChange }: { booking: Booking, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { mutate, isPending } = useCancelBooking()
  const quoted = booking.status === "Accepted"

  return (
    <ReasonDialog
      open={open}
      onOpenChange={onOpenChange}
      title={quoted ? `Turn down ${formatNairaAmount(bookingPrice(booking))}?` : "Cancel this request?"}
      description={`This cancels your booking with ${booking.artisan}, and we'll let them know. You haven't paid anything, and you can book another artisan any time.`}
      quickReasons={CANCEL_REASONS}
      placeholder="Tell the artisan why (optional)"
      submitLabel={quoted ? "Decline and cancel" : "Cancel booking"}
      cancelLabel="Keep booking"
      minLength={0}
      pending={isPending}
      onSubmit={(reason, done) => mutate({ id: booking.id, reason }, { onSuccess: done })}
    />
  )
}

/** Holds the payment until our team settles it with both sides */
const ReportDialog = ({ booking, open, onOpenChange }: { booking: Booking, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { mutate, isPending } = useReportProblem()

  return (
    <ReasonDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Report a problem"
      description={`We'll hold your ${formatNairaAmount(bookingPrice(booking))} and won't pay ${booking.artisan} until our team has looked into it with you both.`}
      quickReasons={REPORT_REASONS}
      placeholder="What went wrong? Add anything that helps us sort it out."
      submitLabel="Report problem"
      cancelLabel="Back"
      pending={isPending}
      onSubmit={(reason, done) => mutate({ id: booking.id, reason }, { onSuccess: done })}
    />
  )
}

interface BookingActionsProps {
  booking: Booking
  className?: string
  /** Also offer the less common actions (cancel a request, report a problem before the job is done) */
  expanded?: boolean
}

/** What the customer can do with a booking right now: pay or turn down the price, confirm the job or report a problem */
const BookingActions = ({ booking, className, expanded = false }: BookingActionsProps) => {
  const { action } = bookingMeta(booking.status)
  const pay = usePayBooking()
  const [dialog, setDialog] = useState<"confirm" | "cancel" | "report" | null>(null)
  const closeDialog = (open: boolean) => !open && setDialog(null)
  const canCancel = CANCELLABLE.includes(booking.status) && (expanded || action === "pay")
  const canReport = REPORTABLE.includes(booking.status) && (expanded || action === "confirm")
  if (!action && !canCancel && !canReport) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {canCancel && (
        <Button size="sm" variant="outline" onClick={() => setDialog("cancel")}>
          <X data-icon="inline-start" />
          {action === "pay" ? "Decline price" : "Cancel booking"}
        </Button>
      )}
      {canReport && (
        <Button size="sm" variant="outline" onClick={() => setDialog("report")}>
          <CircleAlert data-icon="inline-start" />
          Report a problem
        </Button>
      )}
      {action === "pay" && (
        <SubmitButton
          type="button"
          size="sm"
          pending={pay.isPending}
          pendingText="Opening payment…"
          onClick={() => pay.mutate(booking.id)}
        >
          <CreditCard data-icon="inline-start" />
          Pay {formatNairaAmount(bookingPrice(booking))}
        </SubmitButton>
      )}
      {action === "confirm" && (
        <Button size="sm" onClick={() => setDialog("confirm")}>
          <CircleCheckBig data-icon="inline-start" />
          Confirm job done
        </Button>
      )}
      <ConfirmDialog booking={booking} open={dialog === "confirm"} onOpenChange={closeDialog} />
      <CancelDialog booking={booking} open={dialog === "cancel"} onOpenChange={closeDialog} />
      <ReportDialog booking={booking} open={dialog === "report"} onOpenChange={closeDialog} />
    </div>
  )
}

export default BookingActions
