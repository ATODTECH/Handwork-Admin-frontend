/**
 * Booking lifecycle, as stored by the API (`BookArtisan.status`). "Deposit Paid" and "Paid in Full"
 * are bookings from the old 70% deposit + 30% balance flow.
 */
export type BookingStatus =
  | "Pending"
  | "Accepted"
  | "Declined"
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
