import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { markAccountRenamed, useAccountProfile, useSignOut } from "@/hooks/site/use-auth"
import { accountSession } from "@/lib/auth/session"
import { queryKeys } from "@/lib/query/keys"
import { accountDetailsQuery, deleteAccountMutation, updateProfileMutation } from "@/services/account/profile"
import type { AccountDetailsUpdate } from "@/types/account/profile"

/** The signed-in account's own record. Waits for the session cookies, which only exist in the browser */
export const useAccountDetails = () => {
  const profile = useAccountProfile()
  const id = profile ? accountSession.getUserId() : null
  const query = useQuery({
    ...accountDetailsQuery(profile?.role ?? "USER", id ?? ""),
    enabled: !!profile && !!id,
    meta: { silentError: true },
  })
  return { ...query, role: profile?.role ?? null }
}

/** Saves changes; the form shows any errors itself */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const profile = useAccountProfile()
  const mutation = useMutation({
    ...updateProfileMutation(),
    meta: { silentError: true },
    onSuccess: async ({ id, first_name, last_name }) => {
      markAccountRenamed(`${first_name} ${last_name}`.trim())
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.account.profile() }),
        // The onboarding checks and the dashboard's location prompt read the artisan's record
        queryClient.invalidateQueries({ queryKey: queryKeys.account.artisanProfile(id) }),
      ])
    },
  })

  return {
    ...mutation,
    save: (changes: AccountDetailsUpdate | FormData) => {
      const id = accountSession.getUserId()
      if (!profile || !id) return Promise.reject(new Error("You're signed out. Please sign in again."))
      return mutation.mutateAsync({ role: profile.role, id, changes })
    },
  }
}

/** Deactivates the account, then signs out. The form shows why it was refused */
export const useDeleteAccount = () => {
  const signOut = useSignOut()
  return useMutation({ ...deleteAccountMutation(), meta: { silentError: true }, onSuccess: signOut })
}
