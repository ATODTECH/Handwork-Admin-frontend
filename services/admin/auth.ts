import { mutationOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { ApiError } from "@/lib/http/errors"
import { mutationKeys } from "@/lib/query/keys"
import type { AdminLoginRes } from "@/types/admin/auth"
import type { LoginType } from "@/types/site/auth"

export const adminAuthService = {
  /** Same JWT sign-in as the apps, but only staff accounts get into the console (the API also enforces it) */
  signIn: async (credentials: LoginType) => {
    const data = await http.post<AdminLoginRes>("/signin/client", credentials, { skipAuth: true })
    if (!data.is_staff) throw new ApiError("This account doesn't have admin access.", { status: 403 })
    return data
  },
}

export const adminSignInMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.signIn,
    mutationFn: adminAuthService.signIn,
  })
