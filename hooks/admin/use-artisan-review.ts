import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/query/keys"
import {
  approveArtisanMutation,
  artisanReviewCountsQuery,
  artisansForReviewQuery,
  rejectArtisanMutation,
} from "@/services/admin/artisans"
import type { ArtisanForReview, ArtisanReviewFilter } from "@/types/admin/artisans"

export const useArtisansForReview = (status: ArtisanReviewFilter) => useQuery(artisansForReviewQuery(status))

export const useArtisanReviewCounts = () => useQuery(artisanReviewCountsQuery())

const fullName = ({ first_name, last_name }: ArtisanForReview) => `${first_name} ${last_name}`.trim()

/** A decision moves the artisan between tabs, so refetch every list and the counts */
const useRefreshArtisans = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.artisansRoot() })
}

export const useApproveArtisan = () => {
  const refresh = useRefreshArtisans()
  return useMutation({
    ...approveArtisanMutation(),
    onSuccess: async (artisan) => {
      await refresh()
      toast.success(`${fullName(artisan)} is approved and can now get jobs.`)
    },
  })
}

export const useRejectArtisan = () => {
  const refresh = useRefreshArtisans()
  return useMutation({
    ...rejectArtisanMutation(),
    onSuccess: async (artisan) => {
      await refresh()
      toast.success(`${fullName(artisan)} was asked to update their details.`)
    },
  })
}
