import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { ArtisanForReview, ArtisanReviewCounts, ArtisanReviewFilter } from "@/types/admin/artisans"

// Staff-only endpoints; router routes have no trailing slash
export const adminArtisansService = {
  list: (status: ArtisanReviewFilter, signal?: AbortSignal) =>
    http.get<ArtisanForReview[]>("/api/admin/artisans", { params: { status }, signal }),
  counts: (signal?: AbortSignal) => http.get<ArtisanReviewCounts>("/api/admin/artisans/counts", { signal }),
  approve: (id: string) => http.post<ArtisanForReview>(`/api/admin/artisans/${id}/approve`),
  reject: ({ id, reason }: { id: string, reason: string }) =>
    http.post<ArtisanForReview>(`/api/admin/artisans/${id}/reject`, { reason }),
}

export const artisansForReviewQuery = (status: ArtisanReviewFilter) =>
  queryOptions({
    queryKey: queryKeys.admin.artisans(status),
    queryFn: ({ signal }) => adminArtisansService.list(status, signal),
  })

export const artisanReviewCountsQuery = () =>
  queryOptions({
    queryKey: queryKeys.admin.artisanCounts(),
    queryFn: ({ signal }) => adminArtisansService.counts(signal),
  })

export const approveArtisanMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.approveArtisan,
    mutationFn: adminArtisansService.approve,
  })

export const rejectArtisanMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.rejectArtisan,
    mutationFn: adminArtisansService.reject,
  })
