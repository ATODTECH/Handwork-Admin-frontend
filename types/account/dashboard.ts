/** Booking lifecycle, as stored by the API (`BookArtisan.status`) */
export type BookingStatus =
  | "Pending"
  | "Accepted"
  | "Declined"
  | "Deposit Paid"
  | "In Progress"
  | "Completed"
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

/** From `POST /api/book/{id}/pay-deposit/` and `/pay-balance/` */
export interface PaymentInit {
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
