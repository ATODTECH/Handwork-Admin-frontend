import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { accountSession } from "@/lib/auth/session"
import { queryKeys } from "@/lib/query/keys"
import {
  editReviewMutation,
  leaveReviewMutation,
  providerReviewsQuery,
  replyToReviewMutation,
  reviewQuery,
} from "@/services/account/reviews"
import type { Review } from "@/types/account/reviews"

/** A provider's reviews, as anyone can see them */
export const useProviderReviews = (providerId: string) => useQuery({ ...providerReviewsQuery(providerId), enabled: !!providerId })

/** The signed-in provider's own reviews */
export const useMyReviews = () => {
  // Cookie read: stable for the session, and the dashboard is client-only
  const id = typeof document === "undefined" ? "" : accountSession.getUserId() ?? ""
  return useProviderReviews(id)
}

/** One review, e.g. the one a booking points to */
export const useReview = (id: number | null | undefined) => useQuery({ ...reviewQuery(id ?? 0), enabled: !!id })

/** Bookings carry their review, and profiles their average, so refresh everything the review shows up in */
const useRefreshAfterReview = () => {
  const queryClient = useQueryClient()
  return (review: Review) => {
    queryClient.setQueryData(queryKeys.account.review(review.id), review)
    return queryClient.invalidateQueries({ queryKey: queryKeys.account.all })
  }
}

export const useLeaveReview = () => {
  const refresh = useRefreshAfterReview()
  return useMutation({
    ...leaveReviewMutation(),
    onSuccess: async (review) => {
      await refresh(review)
      toast.success("Thanks for your review. It helps other customers choose.")
    },
  })
}

export const useEditReview = () => {
  const refresh = useRefreshAfterReview()
  return useMutation({
    ...editReviewMutation(),
    onSuccess: async (review) => {
      await refresh(review)
      toast.success("Review updated")
    },
  })
}

export const useReplyToReview = () => {
  const refresh = useRefreshAfterReview()
  return useMutation({
    ...replyToReviewMutation(),
    onSuccess: async (review) => {
      await refresh(review)
      toast.success("Reply posted")
    },
  })
}
