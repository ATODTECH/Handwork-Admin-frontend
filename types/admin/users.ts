export type UserFilter = "customers" | "artisans" | "staff" | "deactivated"

export type UserCounts = Record<UserFilter, number>

/** An account as staff see it, from `GET /api/admin/users` */
export interface AdminUser {
  id: string
  name: string
  email: string
  contact: string
  role: "USER" | "ARTISAN"
  is_staff: boolean
  is_active: boolean
  profile_image: string | null
  address: string | null
  city: string | null
  state: string | null
  date_joined: string
  last_login: string | null
  verification_status: "PENDING" | "APPROVED" | "REJECTED"
  wallet_balance: string
  bookings: number
  /** Not yet finished, cancelled or settled */
  open_bookings: number
}
