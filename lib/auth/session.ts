/**
 * Admin JWT storage in first-party cookies, so the route guard can read them on the server.
 * Client-only: every function touches `document`.
 */
export const ACCESS_TOKEN_COOKIE = "hw_admin_access"
export const REFRESH_TOKEN_COOKIE = "hw_admin_refresh"

// Matches the API's ACCESS_TOKEN_LIFETIME (7 days)
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export interface SessionTokens {
  access: string
  refresh: string
}

const readCookie = (name: string) => {
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

const writeCookie = (name: string, value: string, maxAge: number) => {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

export const session = {
  getAccessToken: () => readCookie(ACCESS_TOKEN_COOKIE),
  getRefreshToken: () => readCookie(REFRESH_TOKEN_COOKIE),

  save: ({ access, refresh }: SessionTokens) => {
    writeCookie(ACCESS_TOKEN_COOKIE, access, MAX_AGE_SECONDS)
    writeCookie(REFRESH_TOKEN_COOKIE, refresh, MAX_AGE_SECONDS)
  },

  setAccessToken: (access: string) => writeCookie(ACCESS_TOKEN_COOKIE, access, MAX_AGE_SECONDS),

  clear: () => {
    writeCookie(ACCESS_TOKEN_COOKIE, "", 0)
    writeCookie(REFRESH_TOKEN_COOKIE, "", 0)
  },
}
