import type { BookingStatus } from "@/types/account/dashboard"

/** `?status=` on `GET /api/admin/bookings` (`BOOKING_FILTERS` in the API) */
export type BookingFilter = "disputed" | "requested" | "awaiting_payment" | "in_progress" | "done" | "closed"

export type BookingCounts = Record<BookingFilter | "all", number>

export interface BookingPerson {
  id: string
  name: string
  email: string
  contact: string
}

/** From `GET /api/admin/bookings` (staff only); amounts in naira as decimal strings */
export interface BookingForStaff {
  id: number
  client: BookingPerson
  artisan: BookingPerson | null
  services: string[]
  description: string
  budget: string
  agreed_amount: string | null
  address: string | null
  scheduled_date: string | null
  scheduled_time: string | null
  status: BookingStatus
  created_at: string
  updated_at: string
  fully_paid_at: string | null
  completed_at: string | null
  released_at: string | null
  /** Paystack reference of the payment; needed to refund it */
  payment_reference: string
  cancelled_at: string | null
  cancellation_reason: string
  disputed_at: string | null
  dispute_reason: string
  resolved_at: string | null
  resolved_by: string | null
  resolution_note: string
}

/** Settling a reported problem: pay the artisan, or refund the customer */
export interface ResolveBooking {
  id: number
  outcome: "release" | "refund"
  note: string
}
