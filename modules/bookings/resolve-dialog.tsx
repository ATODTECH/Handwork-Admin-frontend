"use client"

import { useState } from "react"
import { BadgeCheck, Undo2 } from "lucide-react"
import ChoiceCardGroup, { type ChoiceOption } from "@/components/form/choice-card-group"
import SubmitButton from "@/components/form/submit-button"
import TextareaField from "@/components/form/textarea-field"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useResolveBooking } from "@/hooks/admin/use-bookings"
import { artisanEarnings } from "@/lib/bookings"
import { formatNairaAmount } from "@/lib/format"
import type { BookingForStaff, ResolveBooking } from "@/types/admin/bookings"
import { bookingAmount } from "./columns"

const MIN_NOTE = 10
const MAX_NOTE = 1000

interface ResolveDialogProps {
  booking: BookingForStaff | null
  onOpenChange: (open: boolean) => void
}

/** Settles a problem a customer reported: refund them in full, or pay the artisan. Both sides get the note. */
const ResolveDialog = ({ booking, onOpenChange }: ResolveDialogProps) => {
  const [outcome, setOutcome] = useState<ResolveBooking["outcome"]>("refund")
  const [note, setNote] = useState("")
  const [touched, setTouched] = useState(false)
  const { mutate, isPending } = useResolveBooking()
  const error = note.trim().length < MIN_NOTE ? `Explain the decision (at least ${MIN_NOTE} characters).` : undefined
  const amount = booking ? bookingAmount(booking) : 0

  const options: ChoiceOption<ResolveBooking["outcome"]>[] = [
    {
      value: "refund",
      label: "Refund the customer",
      description: `Paystack returns ${formatNairaAmount(amount)} to ${booking?.client.name ?? "them"}. The artisan gets nothing.`,
      icon: Undo2,
    },
    {
      value: "release",
      label: "Pay the artisan",
      description: `${booking?.artisan?.name ?? "The artisan"} gets ${formatNairaAmount(artisanEarnings(amount))} after our fee.`,
      icon: BadgeCheck,
    },
  ]

  const close = (open: boolean) => {
    if (open) return
    setOutcome("refund")
    setNote("")
    setTouched(false)
    onOpenChange(false)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (error || !booking) return
    mutate({ id: booking.id, outcome, note: note.trim() }, { onSuccess: () => close(false) })
  }

  return (
    <Dialog open={booking !== null} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Settle the problem on #{booking?.id}</DialogTitle>
            <DialogDescription>Speak to both sides first. This can&apos;t be undone, and we send them both your note.</DialogDescription>
          </DialogHeader>

          {booking && (
            <p className="rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-hw-grey-700">
              <span className="font-medium text-hw-grey-900">{booking.client.name}:</span> {booking.dispute_reason}
            </p>
          )}

          <ChoiceCardGroup name="outcome" legend="Decision" options={options} value={outcome} onValueChange={setOutcome} disabled={isPending} />

          <TextareaField
            name="resolution-note"
            label="Note to both sides"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            onBlur={() => setTouched(true)}
            error={error}
            touched={touched}
            maxLength={MAX_NOTE}
            placeholder="e.g. The artisan didn't come on the booked day, so we've refunded you in full."
            disabled={isPending}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => close(false)} disabled={isPending}>
              Cancel
            </Button>
            <SubmitButton pending={isPending} pendingText="Settling…" size="default">
              {outcome === "refund" ? "Refund customer" : "Pay artisan"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ResolveDialog
