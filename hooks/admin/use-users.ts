import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/query/keys"
import { adminUserCountsQuery, adminUsersQuery, deactivateUserMutation, reactivateUserMutation } from "@/services/admin/users"
import type { UserFilter } from "@/types/admin/users"

export const useAdminUsers = (status: UserFilter) => useQuery(adminUsersQuery(status))

export const useAdminUserCounts = () => useQuery(adminUserCountsQuery())

/** Moves the account between tabs and can change the artisan and dashboard figures, so refetch them */
const useRefreshAccounts = () => {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.usersRoot() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.artisansRoot() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview() }),
    ])
}

export const useDeactivateUser = () => {
  const refresh = useRefreshAccounts()
  return useMutation({
    ...deactivateUserMutation(),
    onSuccess: async ({ name }) => {
      await refresh()
      toast.success(`${name} has been deactivated.`)
    },
  })
}

export const useReactivateUser = () => {
  const refresh = useRefreshAccounts()
  return useMutation({
    ...reactivateUserMutation(),
    onSuccess: async ({ name }) => {
      await refresh()
      toast.success(`${name} can sign in again.`)
    },
  })
}
