import { mutationOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { mutationKeys } from "@/lib/query/keys"
import type { AdminLoginRes } from "@/types/admin/auth"
import type { LoginType } from "@/types/site/auth"

export const adminAuthService = {
  // TODO: switch to the staff-only admin endpoint once the API side is built
  signIn: (credentials: LoginType) =>
    http.post<AdminLoginRes>("/signin/client", credentials, { skipAuth: true }),
}

export const adminSignInMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.signIn,
    mutationFn: adminAuthService.signIn,
  })
