import { useSyncExternalStore } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { accountSession, isAccountRole, type AccountProfile, type AccountRole } from "@/lib/auth/session"
import { ApiError, isApiError } from "@/lib/http/errors"
import { accountArea, accountHome } from "@/lib/routes"
import { mutationKeys } from "@/lib/query/keys"
import { siteAuthService, siteSignInMutation } from "@/services/site/auth"
import type { AccountLoginRes, LoginType } from "@/types/site/auth"
import type { RegisterType } from "@/types/site/register"

/** Only follow `?next=` into the signed-in role's own area (prevents open redirects) */
const getRedirectTarget = (role: AccountRole, onboarded: boolean) => {
  const home = accountHome(role, onboarded)
  // An artisan mid-onboarding always resumes onboarding first
  if (home !== accountArea(role)) return home
  const next = new URLSearchParams(window.location.search).get("next")
  const area = accountArea(role)
  return next && !next.startsWith("//") && (next === area || next.startsWith(`${area}/`)) ? next : home
}

type AccountSignIn = AccountLoginRes & { role: AccountRole }

/** Sign in, rejecting accounts that have no customer/artisan role (so the form shows the error) */
const signInAccount = async (credentials: LoginType): Promise<AccountSignIn> => {
  const data = await siteAuthService.signIn(credentials)
  if (!isAccountRole(data.role)) throw new ApiError("This account can't sign in here.", { status: 403 })
  return data as AccountSignIn
}

/** Store the session from a sign-in response; returns where the user should go next */
const startSession = (data: AccountSignIn) => {
  const onboarded = data.role === "USER" || data.onboardingComplete
  accountSession.start(data, { role: data.role, name: data.name?.trim() ?? "", onboarded })
  notifyProfileChange()
  return getRedirectTarget(data.role, onboarded)
}

export const useSiteSignIn = () => {
  const router = useRouter()

  return useMutation({
    ...siteSignInMutation(),
    mutationFn: signInAccount,
    onSuccess: (data) => {
      const target = startSession(data)
      const name = data.name?.trim()
      toast.success(name ? `Welcome back, ${name}!` : "Welcome back!")
      router.replace(target)
    },
  })
}

/**
 * Create the account, then sign in with the same credentials.
 * Resolves to the sign-in, or null when the account was created but signing in failed.
 */
const registerAndSignIn = async (payload: RegisterType): Promise<AccountSignIn | null> => {
  const credentials: LoginType = { email: payload.email, password: payload.password }
  try {
    await siteAuthService.register(payload)
  } catch (error) {
    // A timed-out attempt (or an earlier try) may already have created this account:
    // if these credentials sign in, carry on instead of showing "already exists"
    const mayExist = isApiError(error) && (error.timedOut || !!error.fieldErrors.email)
    if (!mayExist) throw error
    return signInAccount(credentials).catch(() => {
      throw error
    })
  }
  return signInAccount(credentials).catch(() => null)
}

/** Creates the account, then signs straight in */
export const useRegister = () => {
  const router = useRouter()

  return useMutation({
    mutationKey: mutationKeys.site.register,
    mutationFn: registerAndSignIn,
    onSuccess: (data, { first_name }) => {
      if (!data) {
        // Account exists but auto sign-in failed: let them sign in by hand
        toast.success("Your account has been created. Please sign in.")
        router.replace("/login")
        return
      }
      const target = startSession(data)
      toast.success(`Welcome to Handwork Expert, ${first_name}!`)
      router.replace(target)
    },
  })
}

export const useSignOut = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return () => {
    accountSession.clear()
    queryClient.clear()
    notifyProfileChange()
    router.replace("/")
  }
}

// ---------------------------------------------------------------------------
// Signed-in profile from the session cookies, safe to read during hydration
// ---------------------------------------------------------------------------

const listeners = new Set<() => void>()
const notifyProfileChange = () => listeners.forEach((listener) => listener())

/** Record in the session that this artisan finished onboarding */
export const markAccountOnboarded = () => {
  accountSession.markOnboarded()
  notifyProfileChange()
}

let cachedKey = ""
let cachedProfile: AccountProfile | null = null

// useSyncExternalStore needs a stable snapshot between changes
const getProfileSnapshot = () => {
  const profile = accountSession.getProfile()
  const key = JSON.stringify(profile)
  if (key !== cachedKey) {
    cachedKey = key
    cachedProfile = profile
  }
  return cachedProfile
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Null on the server and when signed out */
export const useAccountProfile = () => useSyncExternalStore(subscribe, getProfileSnapshot, () => null)
