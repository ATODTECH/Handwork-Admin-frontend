import { mutationOptions } from "@tanstack/react-query"
import { siteHttp } from "@/lib/http/client"
import { mutationKeys } from "@/lib/query/keys"
import type { SiteApiResponse } from "@/types/api"
import type { LoginType } from "@/types/site/auth"
import type { RegisterType } from "@/types/site/register"

// NOTE: the API has no `/v2/api/auth/login/` or `/v2/api/register/` routes yet — these are placeholders
export const siteAuthService = {
  signIn: (credentials: LoginType) => siteHttp.post<SiteApiResponse>("/api/auth/login/", credentials),
  register: (payload: RegisterType) => siteHttp.post<SiteApiResponse>("/api/register/", payload),
}

export const siteSignInMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.site.signIn,
    mutationFn: siteAuthService.signIn,
  })

export const registerMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.site.register,
    mutationFn: siteAuthService.register,
  })
