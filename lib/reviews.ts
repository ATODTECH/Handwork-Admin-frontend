import type { Booking, BookingStatus } from "@/types/account/dashboard"
import type { Review } from "@/types/account/reviews"

/** A job can be reviewed once the provider has been paid (`REVIEWABLE_STATUSES` on the API) */
export const REVIEWABLE: BookingStatus[] = ["Released", "Paid in Full"]

/** The customer can change a review for this long, and only until the provider replies (`REVIEW_EDIT_DAYS`) */
export const REVIEW_EDIT_DAYS = 14

export const MAX_REVIEW = 2000
export const MAX_REPLY = 1000

export const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"] as const

export const canReview = (booking: Booking) => REVIEWABLE.includes(booking.status) && !booking.review

export const canEditReview = (review: Review, now = Date.now()) =>
  !review.reply && now - new Date(review.created_at).getTime() < REVIEW_EDIT_DAYS * 24 * 60 * 60 * 1000

export interface ReviewStats {
  /** Verified reviews only, like the API's `review_summary` */
  average: number | null
  count: number
  /** Verified reviews per star, 5 first */
  byStar: { star: number, count: number }[]
  /** Reviews still waiting for the provider's reply */
  unanswered: number
}

export const reviewStats = (reviews: Review[]): ReviewStats => {
  const verified = reviews.filter(({ verified }) => verified)
  const total = verified.reduce((sum, { star }) => sum + star, 0)
  return {
    average: verified.length ? Math.round((total / verified.length) * 10) / 10 : null,
    count: verified.length,
    byStar: [5, 4, 3, 2, 1].map((star) => ({ star, count: verified.filter((review) => review.star === star).length })),
    unanswered: reviews.filter(({ reply }) => !reply).length,
  }
}

export const reviewCountLabel = (count: number) => `${count} ${count === 1 ? "review" : "reviews"}`
