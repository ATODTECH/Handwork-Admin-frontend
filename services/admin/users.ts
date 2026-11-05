import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { AdminUser, UserCounts, UserFilter } from "@/types/admin/users"

// Staff-only endpoints; router routes have no trailing slash
export const adminUsersService = {
  list: (status: UserFilter, signal?: AbortSignal) => http.get<AdminUser[]>("/api/admin/users", { params: { status }, signal }),
  counts: (signal?: AbortSignal) => http.get<UserCounts>("/api/admin/users/counts", { signal }),
  /** Blocks sign-in and hides an artisan from customers; the reason is emailed to them */
  deactivate: ({ id, reason }: { id: string, reason: string }) => http.post<AdminUser>(`/api/admin/users/${id}/deactivate`, { reason }),
  reactivate: (id: string) => http.post<AdminUser>(`/api/admin/users/${id}/reactivate`),
}

export const adminUsersQuery = (status: UserFilter) =>
  queryOptions({
    queryKey: queryKeys.admin.users(status),
    queryFn: ({ signal }) => adminUsersService.list(status, signal),
  })

export const adminUserCountsQuery = () =>
  queryOptions({
    queryKey: queryKeys.admin.userCounts(),
    queryFn: ({ signal }) => adminUsersService.counts(signal),
  })

export const deactivateUserMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.deactivateUser,
    mutationFn: adminUsersService.deactivate,
  })

export const reactivateUserMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.reactivateUser,
    mutationFn: adminUsersService.reactivate,
  })
