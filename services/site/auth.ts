import { mutationOptions } from "@tanstack/react-query"
import { accountHttp } from "@/lib/http/client"
import { mutationKeys } from "@/lib/query/keys"
import type { AccountLoginRes, AccountRegisterRes, LoginType, ResetCodePayload, ResetPasswordPayload } from "@/types/site/auth"
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

  // Forgot password: the API emails a 6-digit code (valid 10 minutes), checks it, then
  // allows one reset for that email within the next 10 minutes. It answers the same
  // whether or not the email has an account.
  requestResetCode: (email: string) =>
    // Slow like sign-up: the API sends the email before it answers
    accountHttp.post<{ message: string }>("/api/forgot-password/request-otp", { email }, { skipAuth: true, timeout: 90_000 }),
  verifyResetCode: ({ email, code }: ResetCodePayload) =>
    accountHttp.post<{ message: string }>("/api/forgot-password/verify-otp", { email, otp: code }, { skipAuth: true }),
  resetPassword: ({ email, password }: ResetPasswordPayload) =>
    accountHttp.post<{ message: string }>("/api/reset/password", { email, new_password: password }, { skipAuth: true }),
}

export const requestResetCodeMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.site.requestResetCode,
    mutationFn: siteAuthService.requestResetCode,
  })

export const verifyResetCodeMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.site.verifyResetCode,
    mutationFn: siteAuthService.verifyResetCode,
  })

export const resetPasswordMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.site.resetPassword,
    mutationFn: siteAuthService.resetPassword,
  })

export const siteSignInMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.site.signIn,
    mutationFn: siteAuthService.signIn,
  })
