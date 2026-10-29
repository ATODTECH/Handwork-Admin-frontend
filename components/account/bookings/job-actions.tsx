"use client"

import { useState } from "react"
import { Check, CircleCheckBig, Play, X } from "lucide-react"
import FormField from "@/components/form/form-field"
import SubmitButton from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUpdateJob } from "@/hooks/account/use-dashboard"
import { artisanEarnings, bookingTitle, jobMeta, PLATFORM_FEE_RATE } from "@/lib/bookings"
import { formatNairaAmount } from "@/lib/format"
import type { Booking } from "@/types/account/dashboard"

const MIN_PRICE = 500

/** Accept with a final price. The customer then pays Handwork Expert, and we pay the artisan when the job is done */
const AcceptDialog = ({ booking, open, onOpenChange }: { booking: Booking, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [price, setPrice] = useState(String(Math.round(Number(booking.budget)) || ""))
  const [touched, setTouched] = useState(false)
  const { mutate, isPending } = useUpdateJob()
  const amount = Number(price)
  const error = !price ? "Enter your price for this job" : amount < MIN_PRICE ? `Your price must be at least ${formatNairaAmount(MIN_PRICE)}` : undefined

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (error) return
    mutate({ id: booking.id, status: "Accepted", agreedAmount: amount }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Accept {booking.client}&apos;s request</DialogTitle>
            <DialogDescription>
              {bookingTitle(booking)}. Their budget is {formatNairaAmount(booking.budget)}. Set the price you&apos;ll do the job for.
            </DialogDescription>
          </DialogHeader>

          <FormField
            name={`price-${booking.id}`}
            label="Your price"
            startAddon={<span className="text-hw-grey-700">₦</span>}
            inputMode="numeric"
            autoComplete="off"
            value={price}
            onChange={(event) => setPrice(event.target.value.replace(/\D/g, ""))}
            onBlur={() => setTouched(true)}
            error={error}
            touched={touched}
            disabled={isPending}
            description={
              !error &&
              `You'll receive ${formatNairaAmount(artisanEarnings(amount))} after our ${PLATFORM_FEE_RATE * 100}% fee, once the customer has paid in full.`
            }
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <SubmitButton pending={isPending} pendingText="Accepting…" size="default">
              Accept job
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const DeclineDialog = ({ booking, open, onOpenChange }: { booking: Booking, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { mutate, isPending } = useUpdateJob()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Decline this request?</DialogTitle>
          <DialogDescription>
            We&apos;ll let {booking.client} know you can&apos;t take it, so they can book someone else. You can&apos;t undo this.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Keep it
          </Button>
          <SubmitButton
            type="button"
            size="default"
            variant="destructive"
            pending={isPending}
            pendingText="Declining…"
            onClick={() => mutate({ id: booking.id, status: "Declined" }, { onSuccess: () => onOpenChange(false) })}
          >
            Decline
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** What the artisan can do with a job right now; renders nothing while waiting on the customer */
const JobActions = ({ booking }: { booking: Booking }) => {
  const { action } = jobMeta(booking.status)
  const [dialog, setDialog] = useState<"accept" | "decline" | null>(null)
  const { mutate, isPending } = useUpdateJob()
  const closeDialog = (open: boolean) => !open && setDialog(null)

  if (action === "respond") {
    return (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setDialog("decline")}>
          <X data-icon="inline-start" />
          Decline
        </Button>
        <Button size="sm" onClick={() => setDialog("accept")}>
          <Check data-icon="inline-start" />
          Accept
        </Button>
        <AcceptDialog booking={booking} open={dialog === "accept"} onOpenChange={closeDialog} />
        <DeclineDialog booking={booking} open={dialog === "decline"} onOpenChange={closeDialog} />
      </div>
    )
  }

  if (action === "start" || action === "complete") {
    const starting = action === "start"
    return (
      <SubmitButton
        type="button"
        size="sm"
        pending={isPending}
        pendingText={starting ? "Starting…" : "Saving…"}
        onClick={() => mutate({ id: booking.id, status: starting ? "In Progress" : "Completed" })}
      >
        {starting ? <Play data-icon="inline-start" /> : <CircleCheckBig data-icon="inline-start" />}
        {starting ? "Start job" : "Mark as done"}
      </SubmitButton>
    )
  }

  return null
}

export default JobActions
