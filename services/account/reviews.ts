import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { accountHttp } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { Review, ReviewPayload } from "@/types/account/reviews"

// Router routes have no trailing slash (see `setup/urls.py` on the API)
export const reviewsService = {
  // Reviews are public: reads skip the token, like the other public profile reads
  /** A provider's reviews, newest first (staff-hidden ones are left out) */
  forProvider: (providerId: string, signal?: AbortSignal) =>
    accountHttp.get<Review[]>(`/api/artisan_rating?artisan=${encodeURIComponent(providerId)}`, { signal, skipAuth: true }),
  review: (id: number, signal?: AbortSignal) => accountHttp.get<Review>(`/api/artisan_rating/${id}`, { signal, skipAuth: true }),

  /** The customer reviews a released booking; the provider comes from the booking */
  leave: ({ bookingId, star, message }: ReviewPayload & { bookingId: number }) =>
    accountHttp.post<Review>("/api/artisan_rating", { booking: bookingId, star, message }),
  /** Allowed for 14 days and until the provider replies */
  edit: ({ id, star, message }: ReviewPayload & { id: number }) => accountHttp.patch<Review>(`/api/artisan_rating/${id}`, { star, message }),
  /** The reviewed provider answers (or changes their answer) */
  reply: ({ id, reply }: { id: number, reply: string }) => accountHttp.post<Review>(`/api/artisan_rating/${id}/reply`, { reply }),
}

export const providerReviewsQuery = (providerId: string) =>
  queryOptions({
    queryKey: queryKeys.account.providerReviews(providerId),
    queryFn: ({ signal }) => reviewsService.forProvider(providerId, signal),
  })

export const reviewQuery = (id: number) =>
  queryOptions({
    queryKey: queryKeys.account.review(id),
    queryFn: ({ signal }) => reviewsService.review(id, signal),
  })

export const leaveReviewMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.account.leaveReview, mutationFn: reviewsService.leave })

export const editReviewMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.account.editReview, mutationFn: reviewsService.edit })

export const replyToReviewMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.account.replyToReview, mutationFn: reviewsService.reply })
