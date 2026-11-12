import { queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { queryKeys } from "@/lib/query/keys"
import type { Analytics, AnalyticsRange } from "@/types/admin/analytics"

// Staff-only; hand-written route, no trailing slash
export const adminAnalyticsService = {
  get: (months: AnalyticsRange, signal?: AbortSignal) => http.get<Analytics>("/api/admin/analytics", { params: { months }, signal }),
}

export const adminAnalyticsQuery = (months: AnalyticsRange) =>
  queryOptions({
    queryKey: queryKeys.admin.analytics(months),
    queryFn: ({ signal }) => adminAnalyticsService.get(months, signal),
  })
