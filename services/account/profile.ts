import { mutationOptions, queryOptions } from "@tanstack/react-query"
import type { AccountRole } from "@/lib/auth/session"
import { accountHttp } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { AccountDetails, ProfileUpdate } from "@/types/account/profile"

// Photos go to storage through the API, so give them longer than the default timeout
const UPLOAD_TIMEOUT_MS = 120_000

// Artisans use their own route: it sends a rejected artisan back for review when their location changes
const profilePath = (role: AccountRole, id: string) => (role === "ARTISAN" ? `/api/artisan/${id}` : `/api/user/${id}`)

export const profileService = {
  details: (role: AccountRole, id: string, signal?: AbortSignal) =>
    accountHttp.get<AccountDetails>(profilePath(role, id), { signal }),
  update: ({ role, id, changes }: ProfileUpdate) =>
    accountHttp.patch<AccountDetails>(profilePath(role, id), changes, { timeout: UPLOAD_TIMEOUT_MS }),
  /** Refused while a booking is open or an artisan still has money with us */
  deleteAccount: () => accountHttp.delete("/api/delete-account"),
}

export const accountDetailsQuery = (role: AccountRole, id: string) =>
  queryOptions({
    queryKey: queryKeys.account.profile(),
    queryFn: ({ signal }) => profileService.details(role, id, signal),
  })

export const updateProfileMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.updateProfile,
    mutationFn: profileService.update,
  })

export const deleteAccountMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.deleteAccount,
    mutationFn: profileService.deleteAccount,
  })
