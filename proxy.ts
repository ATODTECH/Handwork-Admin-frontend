import { NextResponse, type NextRequest } from "next/server"
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"

/**
 * Optimistic admin route guard: only checks that a session cookie exists.
 * The API still validates the token on every request (and the client redirects on 401).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const isLoginPage = pathname === ROUTES.login
  const hasSession = request.cookies.has(ACCESS_TOKEN_COOKIE)

  if (!hasSession && !isLoginPage) {
    const loginUrl = new URL(ROUTES.login, request.url)
    loginUrl.searchParams.set("next", pathname + search)
    return NextResponse.redirect(loginUrl)
  }

  if (hasSession && isLoginPage) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
