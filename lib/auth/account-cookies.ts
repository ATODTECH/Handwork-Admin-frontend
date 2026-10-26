import {
  ACCOUNT_ACCESS_COOKIE,
  ACCOUNT_ONBOARDED_COOKIE,
  ACCOUNT_ROLE_COOKIE,
  isAccountRole,
  type AccountRole,
} from "@/lib/auth/session"

export interface AccountAccess {
  role: AccountRole
  onboarded: boolean
}

/**
 * Server-side read of the account session cookies (from `proxy.ts` or a Server Component).
 * Null when signed out or the cookies don't describe a known role.
 */
export const readAccountAccess = (getCookie: (name: string) => string | undefined): AccountAccess | null => {
  const role = getCookie(ACCOUNT_ROLE_COOKIE)
  if (!getCookie(ACCOUNT_ACCESS_COOKIE) || !isAccountRole(role)) return null
  return { role, onboarded: role === "USER" || getCookie(ACCOUNT_ONBOARDED_COOKIE) === "1" }
}
