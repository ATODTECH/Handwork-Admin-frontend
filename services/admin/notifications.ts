import { queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { queryKeys } from "@/lib/query/keys"
import type { StaffNotifications } from "@/types/admin/notifications"

// Staff-only; hand-written route, no trailing slash
export const adminNotificationsService = {
  list: (days: number, signal?: AbortSignal) => http.get<StaffNotifications>("/api/admin/notifications", { params: { days }, signal }),
}

export const adminNotificationsQuery = (days: number) =>
  queryOptions({
    queryKey: queryKeys.admin.notifications(days),
    queryFn: ({ signal }) => adminNotificationsService.list(days, signal),
    // Staff keep the console open; new reports and problems should show up without a reload
    refetchInterval: 60_000,
  })
