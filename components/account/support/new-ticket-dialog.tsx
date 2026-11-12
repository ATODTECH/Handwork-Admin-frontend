"use client"

import { useState } from "react"
import { CircleAlert } from "lucide-react"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import SubmitButton from "@/components/form/submit-button"
import TextareaField from "@/components/form/textarea-field"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMyBookings } from "@/hooks/account/use-dashboard"
import { useCreateTicket } from "@/hooks/account/use-support"
import { bookingTitle } from "@/lib/bookings"
import { formatSchedule } from "@/lib/format"
import { toApiError } from "@/lib/http/errors"
import type { SupportTicket, TicketCategory } from "@/types/account/support"
import { TICKET_CATEGORIES } from "./ticket-parts"

const MAX_MESSAGE = 4000

const NewTicketForm = ({ onCreated, onCancel }: { onCreated: (ticket: SupportTicket) => void, onCancel: () => void }) => {
  const create = useCreateTicket()
  const { data: bookings = [] } = useMyBookings()
  const [category, setCategory] = useState<TicketCategory | null>(null)
  const [booking, setBooking] = useState<number | null>(null)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [touched, setTouched] = useState(false)
  const apiError = create.error ? toApiError(create.error) : null
  const errors = {
    category: category ? undefined : "Choose what it's about.",
    subject: subject.trim().length >= 4 ? apiError?.fieldErrors.subject?.[0] : "Give it a short title.",
    message: message.trim().length >= 10 ? apiError?.fieldErrors.message?.[0] : "Tell us a little more (at least 10 characters).",
    booking: apiError?.fieldErrors.booking?.[0],
  }
  const formError = apiError && !["category", "subject", "message", "booking"].some((field) => apiError.fieldErrors[field]) ? apiError.message : null
  const bookingOptions = bookings.map((item) => ({
    value: item.id,
    label: `#${item.id} · ${bookingTitle(item)} · ${formatSchedule(item.scheduled_date)}`,
  }))

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (!category || subject.trim().length < 4 || message.trim().length < 10) return
    create.mutate({ category, subject: subject.trim(), message: message.trim(), booking }, { onSuccess: onCreated })
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle>How can we help?</DialogTitle>
        <DialogDescription>Our team replies here, and we email you when they do.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        <ComboboxField
          name="ticket-category"
          label="What's it about?"
          placeholder="Choose a topic"
          options={TICKET_CATEGORIES}
          value={category}
          onValueChange={setCategory}
          error={errors.category}
          touched={touched}
        />
        {bookingOptions.length > 0 && (
          <ComboboxField
            name="ticket-booking"
            label="Which booking? (optional)"
            placeholder="Choose a booking"
            options={bookingOptions}
            value={booking}
            onValueChange={setBooking}
            error={errors.booking}
            touched={!!errors.booking}
          />
        )}
      </div>
      <FormField
        name="ticket-subject"
        label="Title"
        placeholder="e.g. I was charged twice"
        maxLength={150}
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        error={errors.subject}
        touched={touched || !!apiError}
      />
      <TextareaField
        name="ticket-message"
        label="Tell us what happened"
        placeholder="What you were trying to do, what went wrong, and anything you've already tried."
        maxLength={MAX_MESSAGE}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        error={errors.message}
        touched={touched || !!apiError}
      />
      <p className="text-xs text-hw-grey-500">
        Paid job gone wrong? Use <strong className="font-medium text-hw-grey-700">Report a problem</strong> on the booking instead,
        so we hold the payment while we look into it.
      </p>
      {formError && (
        <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
          <CircleAlert className="size-4" />
          {formError}
        </p>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={create.isPending}>
          Cancel
        </Button>
        <SubmitButton pending={create.isPending} pendingText="Sending…" size="default">
          Send to support
        </SubmitButton>
      </DialogFooter>
    </form>
  )
}

const NewTicketDialog = ({ open, onOpenChange, onCreated }: { open: boolean, onOpenChange: (open: boolean) => void, onCreated: (ticket: SupportTicket) => void }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
      {open && (
        <NewTicketForm
          onCreated={(ticket) => {
            onOpenChange(false)
            onCreated(ticket)
          }}
          onCancel={() => onOpenChange(false)}
        />
      )}
    </DialogContent>
  </Dialog>
)

export default NewTicketDialog
