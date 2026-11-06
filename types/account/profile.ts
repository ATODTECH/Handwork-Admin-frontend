import type { AccountRole } from "@/lib/auth/session"
import type { ArtisanSkill } from "@/types/account/artisan"

/** The signed-in account's own record, from `GET /api/user/{id}` or `GET /api/artisan/{id}` */
export interface AccountDetails {
  id: string
  first_name: string
  last_name: string
  email: string
  contact: string
  profile_image: string | null
  state: string | null
  city: string | null
  address: string | null
  /** Artisans only, once they've added their services */
  skill?: ArtisanSkill | null
}

export type AccountDetailsUpdate = Partial<Pick<AccountDetails, "first_name" | "last_name" | "contact" | "state" | "city" | "address">> & {
  country?: string | null
}

export interface ProfileUpdate {
  role: AccountRole
  id: string
  /** JSON fields, or a form with a new profile photo */
  changes: AccountDetailsUpdate | FormData
}
