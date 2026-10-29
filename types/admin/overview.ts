import type { BookingStatus } from "@/types/account/dashboard"
import type { VerificationStatus } from "@/types/account/artisan"

/** This month against last (calendar months); money in naira as decimal strings */
interface MonthOnMonth<T> {
  this_month: T
  last_month: T
}

/** From `GET /api/admin/overview` (staff only) */
export interface AdminOverview {
  /** Handwork Expert's 10% fee on jobs customers confirmed */
  revenue: MonthOnMonth<string> & { total: string }
  /** Paid by customers, waiting for them to confirm the job */
  held: { amount: string, bookings: number }
  customers: { total: number, new_this_month: number }
  artisans: { approved: number, awaiting_review: number, onboarding: number }
  bookings: MonthOnMonth<number> & { active: number }
  withdrawals: { pending: number, pending_amount: string }
  artisans_awaiting_review: {
    id: string
    name: string
    services: string[]
    city: string | null
    state: string | null
    submitted_at: string
  }[]
  withdrawals_awaiting_approval: {
    id: number
    artisan: string
    amount: string
    bank_name: string
    requested_at: string
  }[]
  recent_bookings: {
    id: number
    customer: string
    artisan: string | null
    services: string[]
    amount: string
    status: BookingStatus
    created_at: string
  }[]
  recent_users: {
    id: string
    name: string
    email: string
    role: "USER" | "ARTISAN"
    verification_status: VerificationStatus | null
    date_joined: string
  }[]
}
