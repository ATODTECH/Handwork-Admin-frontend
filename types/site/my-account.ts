export type UserRole = "user" | "artisan";

export type SectionKey =
  | "profile"
  | "addresses"
  | "password"
  | "notifications"
  | "bookings"
  | "feedbacks"
  | "settings"

export interface Profile {
  firstName: string
  lastName: string
  phone: string
  email: string
  countryOfResidence?: string
  nationality?: string
  avatarUrl?: string
}
