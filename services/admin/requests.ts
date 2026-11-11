import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { OfferForStaff, RequestCounts, RequestDetailForStaff, RequestFilter, RequestForStaff, StaffAction } from "@/types/admin/requests"

// Staff-only endpoints; router routes have no trailing slash
export const adminRequestsService = {
  list: (status: RequestFilter, signal?: AbortSignal) =>
    http.get<RequestForStaff[]>("/api/admin/requests", { params: { status }, signal }),
  counts: (signal?: AbortSignal) => http.get<RequestCounts>("/api/admin/requests/counts", { signal }),
  detail: (id: number, signal?: AbortSignal) => http.get<RequestDetailForStaff>(`/api/admin/requests/${id}`, { signal }),
  /** Closes a draft or open request and turns down its waiting offers; everyone involved is told why */
  close: ({ id, reason }: StaffAction) => http.post<RequestDetailForStaff>(`/api/admin/requests/${id}/close`, { reason }),
  /** Withdraws a waiting offer; the provider is told why and the customer that it was removed */
  withdrawOffer: ({ id, reason }: StaffAction) => http.post<OfferForStaff>(`/api/admin/offers/${id}/withdraw`, { reason }),
}

export const adminRequestsQuery = (status: RequestFilter) =>
  queryOptions({
    queryKey: queryKeys.admin.requests(status),
    queryFn: ({ signal }) => adminRequestsService.list(status, signal),
  })

export const adminRequestCountsQuery = () =>
  queryOptions({
    queryKey: queryKeys.admin.requestCounts(),
    queryFn: ({ signal }) => adminRequestsService.counts(signal),
  })

export const adminRequestQuery = (id: number) =>
  queryOptions({
    queryKey: queryKeys.admin.request(id),
    queryFn: ({ signal }) => adminRequestsService.detail(id, signal),
  })

export const closeRequestMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.admin.closeRequest, mutationFn: adminRequestsService.close })

export const withdrawOfferMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.admin.withdrawOffer, mutationFn: adminRequestsService.withdrawOffer })
