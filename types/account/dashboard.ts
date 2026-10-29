/**
 * Booking lifecycle, as stored by the API (`BookArtisan.status`). The customer can cancel before paying
 * (Cancelled) and report a problem once paid (Disputed); staff settle it as Released or Refunded.
 * "Deposit Paid" and "Paid in Full" are bookings from the old 70% deposit + 30% balance flow.
 */
export type BookingStatus =
  | "Pending"
  | "Accepted"
  | "Declined"
  | "Cancelled"
  | "Disputed"
  | "Refunded"
  | "Paid"
  | "Deposit Paid"
  | "In Progress"
  | "Completed"
  | "Released"
  | "Paid in Full"

/** A booking from `GET /api/my_bookings` (decimal fields arrive as strings, in naira) */
export interface Booking {
  id: number
  /** Artisan's full name */
  artisan: string
  /** Customer's full name */
  client: string
  /** Service names */
  services: string[]
  description: string
  budget: string
  agreed_amount: string | null
  address: string | null
  /** YYYY-MM-DD */
  scheduled_date: string | null
  /** HH:MM:SS */
  scheduled_time: string | null
  status: BookingStatus
  /** When the artisan marked it done; we pay them automatically a while after */
  completed_at: string | null
  fully_paid_at: string | null
  released_at: string | null
  cancelled_at: string | null
  cancellation_reason: string
  /** When the customer reported a problem, which holds the payment for staff */
  disputed_at: string | null
  dispute_reason: string
  resolved_at: string | null
  /** Staff's note when they settled the problem */
  resolution_note: string
  /** The other side's phone number, shared once the job is paid for */
  contact: string | null
  created_at: string
  updated_at: string
}

/** The changes an artisan can make to a booking (`PATCH /api/book/artisan/{id}`) */
export interface JobUpdate {
  id: number
  status: Extract<BookingStatus, "Accepted" | "Declined" | "In Progress" | "Completed">
  /** Naira; required when accepting */
  agreedAmount?: number
}

/** From `POST /api/book/{id}/pay`: a Paystack transaction for the full agreed price */
export interface PaymentInit {
  /** Resumed in Paystack's pop-up */
  access_code: string
  /** Paystack's own checkout page, if the pop-up can't load */
  authorization_url: string
  reference: string
  amount: string
}

/** A notification from `GET /api/notifications` */
export interface AccountNotification {
  id: number
  message: string
  /** e.g. SIGNUP, PASSWORD_RESET, RATING, BANK_DETAILS, SKILL */
  notification_type: string
  created_at: string
  is_read: boolean
}
