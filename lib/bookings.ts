import type { SemanticTone } from "@/lib/tones"
import type { Booking, BookingStatus } from "@/types/account/dashboard"

/** Handwork Expert's cut of each job; the artisan earns the rest (`PLATFORM_FEE` in the API's job_process.py) */
export const PLATFORM_FEE_RATE = 0.1

/** Hours after the artisan marks a job done before we pay them without the customer's confirmation (`RELEASE_AFTER_HOURS`) */
export const RELEASE_AFTER_HOURS = 48

/** The happy path every booking moves along */
export const BOOKING_STEPS = ["Requested", "Accepted", "Paid", "In progress", "Done", "Confirmed"] as const

export type BookingGroup = "active" | "action" | "done" | "declined"

/** What the customer has to do next */
export type CustomerAction = "pay" | "confirm"

interface StatusMeta {
  /** Customer-facing label */
  label: string
  tone: SemanticTone
  /** Index into BOOKING_STEPS; -1 when the booking left the happy path */
  step: number
  group: BookingGroup
  action?: CustomerAction
  /** One line on what happens next */
  hint: string
}

// "Deposit Paid" and "Paid in Full" are bookings from the old 70% deposit + 30% balance flow
const STATUS_META: Record<BookingStatus, StatusMeta> = {
  Pending: { label: "Awaiting artisan", tone: "warning", step: 0, group: "active", hint: "The artisan is reviewing your request." },
  Accepted: { label: "Pay to confirm", tone: "brand", step: 1, group: "action", action: "pay", hint: "Accepted! Pay to confirm. We hold your payment until the job is done." },
  Paid: { label: "Booked", tone: "info", step: 2, group: "active", hint: "Paid. We're holding it, and only pay the artisan once you confirm the job is done." },
  "Deposit Paid": { label: "Booked", tone: "info", step: 2, group: "active", hint: "Your artisan will start on the day." },
  "In Progress": { label: "In progress", tone: "info", step: 3, group: "active", hint: "Your artisan is on the job." },
  Completed: { label: "Confirm job", tone: "brand", step: 4, group: "action", action: "confirm", hint: "The artisan says the job is done. Confirm it so we can pay them." },
  Released: { label: "Completed", tone: "success", step: 5, group: "done", hint: "All done. Thanks for using Handwork Expert!" },
  "Paid in Full": { label: "Completed", tone: "success", step: 5, group: "done", hint: "All done. Thanks for using Handwork Expert!" },
  Declined: { label: "Declined", tone: "danger", step: -1, group: "declined", hint: "The artisan couldn't take this job. Try another artisan." },
}

const FALLBACK_META: StatusMeta = { label: "Unknown", tone: "neutral", step: -1, group: "active", hint: "" }

export const bookingMeta = (status: BookingStatus): StatusMeta => STATUS_META[status] ?? FALLBACK_META

/** Agreed price once the artisan accepts, otherwise the customer's budget */
export const bookingPrice = (booking: Booking) => Number(booking.agreed_amount ?? booking.budget) || 0

/** What the customer has paid on this booking (everything, once paid) */
export const bookingAmountPaid = (booking: Booking) => (bookingMeta(booking.status).step >= 2 ? bookingPrice(booking) : 0)

/** When we pay the artisan if the customer neither confirms nor reports a problem */
export const autoReleaseAt = (booking: Booking) =>
  booking.completed_at ? new Date(new Date(booking.completed_at).getTime() + RELEASE_AFTER_HOURS * 3_600_000) : null

export const bookingTitle = (booking: Booking) => booking.services.join(", ") || "Service request"

const scheduleTime = (booking: Booking) =>
  booking.scheduled_date ? new Date(`${booking.scheduled_date}T${booking.scheduled_time ?? "00:00:00"}`).getTime() : Infinity

/** Soonest scheduled first; unscheduled last */
export const sortBySchedule = (bookings: Booking[]) => [...bookings].sort((a, b) => scheduleTime(a) - scheduleTime(b))

/** Newest first */
export const sortByRecent = (bookings: Booking[]) =>
  [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

/** The booking that most needs the customer's attention: anything waiting on them first, then the soonest open job */
export const nextBooking = (bookings: Booking[]) => {
  const open = bookings.filter(({ status }) => ["active", "action"].includes(bookingMeta(status).group))
  const due = open.filter(({ status }) => bookingMeta(status).action)
  const pool = due.length ? due : open
  return [...pool].sort((a, b) => scheduleTime(a) - scheduleTime(b))[0]
}

export const summarizeBookings = (bookings: Booking[]) => ({
  active: bookings.filter(({ status }) => bookingMeta(status).group === "active").length,
  needsAction: bookings.filter(({ status }) => bookingMeta(status).group === "action").length,
  completed: bookings.filter(({ status }) => bookingMeta(status).group === "done").length,
  totalSpent: bookings.reduce((sum, booking) => sum + bookingAmountPaid(booking), 0),
})

export const filterByGroup = (bookings: Booking[], group: BookingGroup | "all") =>
  group === "all" ? bookings : bookings.filter(({ status }) => bookingMeta(status).group === group)

// The same bookings, as the artisan sees them ("jobs")

export type JobGroup = "new" | "active" | "done" | "declined"

/** What the artisan can do next */
export type JobAction = "respond" | "start" | "complete"

interface JobMeta {
  /** Artisan-facing label */
  label: string
  tone: SemanticTone
  group: JobGroup
  action?: JobAction
  hint: string
}

const JOB_META: Record<BookingStatus, JobMeta> = {
  Pending: { label: "New request", tone: "brand", group: "new", action: "respond", hint: "Accept with your price, or decline." },
  Accepted: { label: "Awaiting payment", tone: "warning", group: "active", hint: "Waiting for the customer to pay." },
  Paid: { label: "Ready to start", tone: "info", group: "active", action: "start", hint: "The customer has paid. Start the job on the day." },
  "Deposit Paid": { label: "Ready to start", tone: "info", group: "active", action: "start", hint: "Deposit paid. Start the job on the day." },
  "In Progress": { label: "In progress", tone: "info", group: "active", action: "complete", hint: "Mark it done when you've finished." },
  Completed: {
    label: "Awaiting confirmation",
    tone: "warning",
    group: "active",
    hint: `Waiting for the customer to confirm. We pay you automatically ${RELEASE_AFTER_HOURS} hours after you marked it done.`,
  },
  Released: { label: "Paid", tone: "success", group: "done", hint: "Your earnings were added to your balance." },
  "Paid in Full": { label: "Paid", tone: "success", group: "done", hint: "Your earnings were added to your balance." },
  Declined: { label: "Declined", tone: "danger", group: "declined", hint: "You declined this request." },
}

const FALLBACK_JOB_META: JobMeta = { label: "Unknown", tone: "neutral", group: "active", hint: "" }

export const jobMeta = (status: BookingStatus): JobMeta => JOB_META[status] ?? FALLBACK_JOB_META

/** What the artisan is paid for a job once the customer confirms it */
export const artisanEarnings = (price: number) => Math.round(price * (1 - PLATFORM_FEE_RATE))

export const filterJobs = (bookings: Booking[], group: JobGroup | "all") =>
  group === "all" ? bookings : bookings.filter(({ status }) => jobMeta(status).group === group)
