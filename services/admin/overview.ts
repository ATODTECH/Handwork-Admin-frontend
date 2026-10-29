import { queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { queryKeys } from "@/lib/query/keys"
import type { AdminOverview } from "@/types/admin/overview"

// Staff-only; router routes have no trailing slash
export const adminOverviewService = {
  overview: (signal?: AbortSignal) => http.get<AdminOverview>("/api/admin/overview", { signal }),
}

export const adminOverviewQuery = () =>
  queryOptions({
    queryKey: queryKeys.admin.overview(),
    queryFn: ({ signal }) => adminOverviewService.overview(signal),
  })
