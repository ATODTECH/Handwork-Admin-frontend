import type { WorkAvailability } from "./artisan"

/** A service as nested in an artisan's skill and in a category */
export interface ServiceRef {
  id: number
  name: string
}

/** An artisan's skill as customers see it (decimal fields arrive as strings) */
export interface PublicSkill extends Record<WorkAvailability, boolean> {
  id: number
  description: string
  base_charge: string
  cap_charge: string
  services: ServiceRef[]
  images: { url: string }[]
}

/** From `GET /api/artisan` and `GET /api/artisan/{id}`: the public profile, with no contact details */
export interface PublicArtisan {
  id: string
  first_name: string
  last_name: string
  profile_image: string | null
  state: string | null
  city: string | null
  isAvailable: boolean
  skill: PublicSkill | null
}

/** From `GET /api/category` */
export interface ServiceCategory {
  id: number
  name: string
  service: ServiceRef[]
}

export interface BookingPayload {
  artisanId: string
  serviceIds: number[]
  description: string
  budget: number
  address: string
  /** YYYY-MM-DD */
  date: string
  /** HH:MM */
  time: string
}
