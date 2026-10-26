import { mutationOptions } from "@tanstack/react-query"
import { accountHttp } from "@/lib/http/client"
import { mutationKeys } from "@/lib/query/keys"
import type { AccountLoginRes, AccountRegisterRes, LoginType } from "@/types/site/auth"
import type { RegisterType } from "@/types/site/register"

// The API's router is built with `trailing_slash=False`: router routes (`/api/user`, `/api/artisan`, ...)
// 404 with a trailing slash, while hand-written paths like `/api/token/refresh/` keep theirs
export const siteAuthService = {
  signIn: (credentials: LoginType) =>
    accountHttp.post<AccountLoginRes>("/signin/client", credentials, { skipAuth: true }),
  register: ({ role, ...payload }: RegisterType) =>
    accountHttp.post<AccountRegisterRes>(
      role === "ARTISAN" ? "/api/artisan" : "/api/user",
      { ...payload, role },
      // Creating an account can be slow: the API sends the welcome email before it answers
      { skipAuth: true, timeout: 90_000 },
    ),
}

export const siteSignInMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.site.signIn,
    mutationFn: siteAuthService.signIn,
  })
