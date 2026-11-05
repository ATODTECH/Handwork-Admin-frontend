/** A service as staff manage it, from `GET /api/admin/services` */
export interface AdminService {
  id: number
  name: string
  description: string
  /** False when hidden from new artisans and the category lists */
  active: boolean
  /** Category ids */
  categories: number[]
  /** How many artisans offer it */
  artisans: number
  /** How many bookings used it */
  bookings: number
}

export interface ServicePayload {
  name: string
  description: string
  categories: number[]
}

/** From `GET /api/category`; only what the service form needs */
export interface AdminCategory {
  id: number
  name: string
}
