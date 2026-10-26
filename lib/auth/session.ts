/**
 * JWT storage in first-party cookies, so the route guard (`proxy.ts`) can read them on the server.
 * Two independent sessions: admin staff, and customer/artisan accounts, so signing in to one never signs out the other.
 * Client-only: every method touches `document`.
 */
export const ACCESS_TOKEN_COOKIE = "hw_admin_access"
export const REFRESH_TOKEN_COOKIE = "hw_admin_refresh"

export const ACCOUNT_ACCESS_COOKIE = "hw_access"
export const ACCOUNT_REFRESH_COOKIE = "hw_refresh"
/** Read by the route guard to send each role to its own area */
export const ACCOUNT_ROLE_COOKIE = "hw_role"
/** "1" once an artisan has finished onboarding (always "1" for customers) */
export const ACCOUNT_ONBOARDED_COOKIE = "hw_onboarded"
/** Display name for the signed-in header */
export const ACCOUNT_NAME_COOKIE = "hw_name"

// Matches the API's ACCESS_TOKEN_LIFETIME (7 days)
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export type AccountRole = "USER" | "ARTISAN"

export const isAccountRole = (value: unknown): value is AccountRole => value === "USER" || value === "ARTISAN"

export interface SessionTokens {
  access: string
  refresh: string
}

export interface AccountProfile {
  role: AccountRole
  name: string
  onboarded: boolean
}

const readCookie = (name: string) => {
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

const writeCookie = (name: string, value: string, maxAge: number) => {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

const createTokenStore = (accessCookie: string, refreshCookie: string) => ({
  getAccessToken: () => readCookie(accessCookie),
  getRefreshToken: () => readCookie(refreshCookie),

  save: ({ access, refresh }: SessionTokens) => {
    writeCookie(accessCookie, access, MAX_AGE_SECONDS)
    writeCookie(refreshCookie, refresh, MAX_AGE_SECONDS)
  },

  setAccessToken: (access: string) => writeCookie(accessCookie, access, MAX_AGE_SECONDS),

  clear: () => {
    writeCookie(accessCookie, "", 0)
    writeCookie(refreshCookie, "", 0)
  },
})

export type TokenStore = ReturnType<typeof createTokenStore>

/** Admin staff session */
export const session = createTokenStore(ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE)

const accountTokens = createTokenStore(ACCOUNT_ACCESS_COOKIE, ACCOUNT_REFRESH_COOKIE)

/** Customer/artisan session */
export const accountSession = {
  ...accountTokens,

  /** Store the tokens plus what the route guard needs to route this role */
  start: (tokens: SessionTokens, { role, name, onboarded }: AccountProfile) => {
    accountTokens.save(tokens)
    writeCookie(ACCOUNT_ROLE_COOKIE, role, MAX_AGE_SECONDS)
    writeCookie(ACCOUNT_NAME_COOKIE, name, MAX_AGE_SECONDS)
    writeCookie(ACCOUNT_ONBOARDED_COOKIE, onboarded ? "1" : "0", MAX_AGE_SECONDS)
  },

  /** Null when signed out or the cookies were tampered with */
  getProfile: (): AccountProfile | null => {
    const role = readCookie(ACCOUNT_ROLE_COOKIE)
    if (!accountTokens.getAccessToken() || !isAccountRole(role)) return null
    return {
      role,
      name: readCookie(ACCOUNT_NAME_COOKIE) ?? "",
      onboarded: readCookie(ACCOUNT_ONBOARDED_COOKIE) === "1",
    }
  },

  clear: () => {
    accountTokens.clear()
    for (const name of [ACCOUNT_ROLE_COOKIE, ACCOUNT_NAME_COOKIE, ACCOUNT_ONBOARDED_COOKIE]) writeCookie(name, "", 0)
  },
}
