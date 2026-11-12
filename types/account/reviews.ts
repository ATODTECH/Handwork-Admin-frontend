/** A review from `/api/artisan_rating`: one per released booking, written by the customer */
export interface Review {
  id: number
  /** The reviewer as "First L." */
  client: string
  /** The provider's full name */
  artisan: string
  /** The job reviewed; null on old ratings from before reviews were tied to jobs */
  booking: number | null
  /** 1 to 5 */
  star: number
  /** Optional written part */
  message: string
  /** The provider's answer, empty until they reply */
  reply: string
  replied_at: string | null
  /** Tied to a paid job; only these count in a provider's average */
  verified: boolean
  /** The services on the job reviewed */
  services: string[]
  created_at: string
  updated_at: string
}

/** From `review_summary` on a provider's profile: verified reviews only */
export interface ReviewSummary {
  average: number | null
  count: number
}

export interface ReviewPayload {
  star: number
  message: string
}
