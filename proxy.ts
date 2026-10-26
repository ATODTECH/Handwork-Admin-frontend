import { NextResponse, type NextRequest } from "next/server"
import { readAccountAccess } from "@/lib/auth/account-cookies"
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session"
import { ACCOUNT_ROUTES, accountArea, accountHome, ROUTES } from "@/lib/routes"

const isWithin = (pathname: string, area: string) => pathname === area || pathname.startsWith(`${area}/`)

const redirectTo = (request: NextRequest, pathname: string, next?: string) => {
  const url = new URL(pathname, request.url)
  if (next) url.searchParams.set("next", next)
  return NextResponse.redirect(url)
}

/** Admin console: only checks that a staff session cookie exists */
const guardAdmin = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl
  const isLoginPage = pathname === ROUTES.login
  const hasSession = request.cookies.has(ACCESS_TOKEN_COOKIE)

  if (!hasSession && !isLoginPage) return redirectTo(request, ROUTES.login, pathname + search)
  if (hasSession && isLoginPage) return redirectTo(request, ROUTES.dashboard)
  return NextResponse.next()
}

/** Customer and artisan dashboards: keeps each role in its own area, and artisans in onboarding until it's done */
const guardAccount = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl
  const access = readAccountAccess((name) => request.cookies.get(name)?.value)
  const isAuthPage = pathname === ACCOUNT_ROUTES.login || pathname === ACCOUNT_ROUTES.register

  if (!access) {
    return isAuthPage ? NextResponse.next() : redirectTo(request, ACCOUNT_ROUTES.login, pathname + search)
  }

  const { role, onboarded } = access
  const home = accountHome(role, onboarded)

  // `/dashboard` itself is the entry point: send each role to its own dashboard
  if (isAuthPage || !isWithin(pathname, accountArea(role))) return redirectTo(request, home)

  if (role === "ARTISAN") {
    const onOnboarding = isWithin(pathname, ACCOUNT_ROUTES.artisanOnboarding)
    if (onboarded === onOnboarding) return redirectTo(request, home)
  }

  return NextResponse.next()
}

/**
 * Optimistic route guard: reads only the session cookies.
 * The API still validates the token on every request (and the client redirects on 401).
 */
export function proxy(request: NextRequest) {
  return isWithin(request.nextUrl.pathname, "/admin") ? guardAdmin(request) : guardAccount(request)
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
}
