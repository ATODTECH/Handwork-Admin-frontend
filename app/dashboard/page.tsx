import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { readAccountAccess } from "@/lib/auth/account-cookies"
import { ACCOUNT_ROUTES, accountHome } from "@/lib/routes"

/**
 * `/dashboard` has no UI of its own: it sends each role to its dashboard.
 * `proxy.ts` normally redirects first; this keeps the entry point correct without it.
 */
const DashboardEntry = async () => {
  const cookieStore = await cookies()
  const access = readAccountAccess((name) => cookieStore.get(name)?.value)

  if (!access) redirect(`${ACCOUNT_ROUTES.login}?next=${encodeURIComponent(ACCOUNT_ROUTES.dashboard)}`)
  redirect(accountHome(access.role, access.onboarded))
}

export default DashboardEntry
