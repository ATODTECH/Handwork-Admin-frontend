import type { SemanticTone } from "@/lib/tones"
import type { Booking, BookingStatus } from "@/types/account/dashboard"

/** Share of the agreed price paid up front (`BookArtisan.DEPOSIT_PERCENTAGE` on the API) */
export const DEPOSIT_RATE = 0.7

/** Handwork Expert's cut of each job; the artisan earns the rest (10% in the API's payment code) */
export const PLATFORM_FEE_RATE = 0.1

/** The happy path every booking moves along */
export const BOOKING_STEPS = ["Requested", "Accepted", "Deposit paid", "In progress", "Completed", "Paid"] as const

export type BookingGroup = "active" | "payment" | "done" | "declined"

export type PaymentKind = "deposit" | "balance"

interface StatusMeta {
  /** Customer-facing label */
  label: string
  tone: SemanticTone
  /** Index into BOOKING_STEPS; -1 when the booking left the happy path */
  step: number
  group: BookingGroup
  /** What the customer owes next, if anything */
  payment?: PaymentKind
  /** One line on what happens next */
  hint: string
}

const STATUS_META: Record<BookingStatus, StatusMeta> = {
  Pending: { label: "Awaiting artisan", tone: "warning", step: 0, group: "active", hint: "The artisan is reviewing your request." },
  Accepted: { label: "Pay deposit", tone: "brand", step: 1, group: "payment", payment: "deposit", hint: "Accepted! Pay the deposit to lock in your artisan." },
  "Deposit Paid": { label: "Scheduled", tone: "info", step: 2, group: "active", hint: "Deposit received. Your artisan will start on the day." },
  "In Progress": { label: "In progress", tone: "info", step: 3, group: "active", hint: "Your artisan is on the job." },
  Completed: { label: "Pay balance", tone: "brand", step: 4, group: "payment", payment: "balance", hint: "Job done. Pay the balance to close it out." },
  "Paid in Full": { label: "Completed", tone: "success", step: 5, group: "done", hint: "All paid. Thanks for using Handwork Expert!" },
  Declined: { label: "Declined", tone: "danger", step: -1, group: "declined", hint: "The artisan couldn't take this job. Try another artisan." },
}

const FALLBACK_META: StatusMeta = { label: "Unknown", tone: "neutral", step: -1, group: "active", hint: "" }

export const bookingMeta = (status: BookingStatus): StatusMeta => STATUS_META[status] ?? FALLBACK_META

/** Agreed price once the artisan accepts, otherwise the customer's budget */
export const bookingPrice = (booking: Booking) => Number(booking.agreed_amount ?? booking.budget) || 0

/** What the customer has paid so far on this booking */
export const bookingAmountPaid = (booking: Booking) => {
  const price = bookingPrice(booking)
  const { step } = bookingMeta(booking.status)
  if (step >= 5) return price
  if (step >= 2) return price * DEPOSIT_RATE
  return 0
}

/** What the next payment will be, if one is due */
export const bookingAmountDue = (booking: Booking) => {
  const { payment } = bookingMeta(booking.status)
  const price = bookingPrice(booking)
  if (payment === "deposit") return price * DEPOSIT_RATE
  if (payment === "balance") return price - price * DEPOSIT_RATE
  return 0
}

export const bookingTitle = (booking: Booking) => booking.services.join(", ") || "Service request"

const scheduleTime = (booking: Booking) =>
  booking.scheduled_date ? new Date(`${booking.scheduled_date}T${booking.scheduled_time ?? "00:00:00"}`).getTime() : Infinity

/** Newest first */
export const sortByRecent = (bookings: Booking[]) =>
  [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

/** The booking that most needs the customer's attention: payments due first, then the soonest open job */
export const nextBooking = (bookings: Booking[]) => {
  const open = bookings.filter(({ status }) => ["active", "payment"].includes(bookingMeta(status).group))
  const due = open.filter(({ status }) => bookingMeta(status).payment)
  const pool = due.length ? due : open
  return [...pool].sort((a, b) => scheduleTime(a) - scheduleTime(b))[0]
}

export const summarizeBookings = (bookings: Booking[]) => ({
  active: bookings.filter(({ status }) => bookingMeta(status).group === "active").length,
  awaitingPayment: bookings.filter(({ status }) => bookingMeta(status).group === "payment").length,
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
  Accepted: { label: "Awaiting deposit", tone: "warning", group: "active", hint: "Waiting for the customer to pay the deposit." },
  "Deposit Paid": { label: "Ready to start", tone: "info", group: "active", action: "start", hint: "Deposit paid. Start the job on the day." },
  "In Progress": { label: "In progress", tone: "info", group: "active", action: "complete", hint: "Mark it done when you've finished." },
  Completed: { label: "Awaiting payment", tone: "warning", group: "active", hint: "Waiting for the customer to pay the rest." },
  "Paid in Full": { label: "Paid", tone: "success", group: "done", hint: "Fully paid. Your earnings were added to your balance." },
  Declined: { label: "Declined", tone: "danger", group: "declined", hint: "You declined this request." },
}

const FALLBACK_JOB_META: JobMeta = { label: "Unknown", tone: "neutral", group: "active", hint: "" }

export const jobMeta = (status: BookingStatus): JobMeta => JOB_META[status] ?? FALLBACK_JOB_META

/** What the artisan is paid for a job once it's fully paid */
export const artisanEarnings = (price: number) => Math.round(price * (1 - PLATFORM_FEE_RATE))

export const filterJobs = (bookings: Booking[], group: JobGroup | "all") =>
  group === "all" ? bookings : bookings.filter(({ status }) => jobMeta(status).group === group)
