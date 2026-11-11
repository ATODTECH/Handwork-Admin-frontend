/** Window lengths the Reports page offers (`?months=` on `GET /api/admin/analytics`, 3–24) */
export type AnalyticsRange = 3 | 6 | 12

/** Money arrives as decimal strings in naira */
type Money = string

export interface AnalyticsTotals {
  /** Our 10% on jobs released in the window */
  fees: Money
  /** Full price of those jobs */
  job_value: Money
  paid_to_artisans: Money
  bookings: number
  completed: number
  cancelled: number
  problems_reported: number
  refunds: number
  refunded_amount: Money
  new_customers: number
  new_artisans: number
  artisans_approved: number
  requests: number
  offers: number
  /** Verified reviews only */
  reviews: number
  average_rating: number | null
  reports: number
}

/** From `GET /api/admin/analytics` (staff only). Every series lines up with `months`, oldest first. */
export interface Analytics {
  /** "YYYY-MM", Lagos months */
  months: string[]
  from: string
  to: string
  series: {
    fees: Money[]
    job_value: Money[]
    bookings: number[]
    completed: number[]
    requests: number[]
    new_customers: number[]
    new_artisans: number[]
  }
  totals: AnalyticsTotals
  /** The same figures for the window just before, to compare against */
  previous: AnalyticsTotals
  /** Requests posted in the window and how far they got */
  funnel: {
    posted: number
    with_offer: number
    accepted: number
    completed: number
    average_offers: number
    median_hours_to_first_offer: number | null
  }
  top_categories: { name: string, bookings: number, requests: number, job_value: Money }[]
  top_artisans: { id: string, name: string, jobs: number, job_value: Money, earned: Money }[]
}
