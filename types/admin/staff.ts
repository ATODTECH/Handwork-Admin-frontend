/** ADMIN can do everything; SUPPORT can't approve payouts, settle reported problems or manage staff */
export type StaffRole = "ADMIN" | "SUPPORT"

/** From `GET /api/admin/me` and `GET /api/admin/staff` */
export interface StaffMember {
  id: string
  first_name: string
  last_name: string
  email: string
  contact: string
  profile_image: string | null
  role: StaffRole
  is_active: boolean
  /** The signed-in staff member */
  is_you: boolean
  last_login: string | null
  date_joined: string
}

export interface NewStaff {
  first_name: string
  last_name: string
  email: string
  contact: string
  role: StaffRole
}

/** From `POST /api/admin/staff`: the temporary password is shown once */
export interface CreatedStaff extends StaffMember {
  temporary_password: string
}

export interface PasswordChange {
  current_password: string
  new_password: string
}
