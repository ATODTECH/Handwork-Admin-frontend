import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { accountSession } from "@/lib/auth/session"
import { queryKeys } from "@/lib/query/keys"
import {
  artisanProfileQuery,
  banksQuery,
  saveBankDetailsMutation,
  saveIdentityMutation,
  saveSkillMutation,
  serviceOptionsQuery,
} from "@/services/account/artisan-onboarding"
import type { ArtisanProfile } from "@/types/account/artisan"

export type OnboardingStepId = "identity" | "services" | "payout"

/** In the order the artisan completes them (mirrors the mobile app) */
export const ONBOARDING_STEP_IDS: OnboardingStepId[] = ["identity", "services", "payout"]

/** Which steps the API already has, read from the artisan's own record */
export const getCompletedSteps = (profile: ArtisanProfile): Record<OnboardingStepId, boolean> => ({
  identity: !!(profile.nin && profile.document),
  services: !!profile.skill,
  payout: profile.onboardingComplete,
})

const useUserId = () => {
  // Cookie read: stable for the session, and onboarding is client-only
  const id = typeof document === "undefined" ? null : accountSession.getUserId()
  return id ?? ""
}

/** The artisan's record plus where they are in onboarding */
export const useOnboardingProgress = () => {
  const userId = useUserId()
  const query = useQuery({ ...artisanProfileQuery(userId), enabled: !!userId })
  const completed = query.data ? getCompletedSteps(query.data) : null
  const current = completed ? (ONBOARDING_STEP_IDS.find((id) => !completed[id]) ?? null) : null
  const completedCount = completed ? ONBOARDING_STEP_IDS.filter((id) => completed[id]).length : 0

  return { ...query, isPending: query.isPending || !userId, completed, current, completedCount }
}

export const useServiceOptions = () => useQuery(serviceOptionsQuery())

export const useBanks = () => useQuery(banksQuery())

/** Refetch the profile so the stepper moves on to the next step */
const useRefreshProfile = () => {
  const queryClient = useQueryClient()
  const userId = useUserId()
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.account.artisanProfile(userId) })
}

export const useSaveIdentity = () => {
  const userId = useUserId()
  const refreshProfile = useRefreshProfile()

  return useMutation({
    ...saveIdentityMutation(userId),
    meta: { silentError: true },
    onSuccess: async () => {
      await refreshProfile()
      toast.success("ID details saved")
    },
  })
}

export const useSaveSkill = () => {
  const refreshProfile = useRefreshProfile()

  return useMutation({
    ...saveSkillMutation(),
    meta: { silentError: true },
    onSuccess: async () => {
      await refreshProfile()
      toast.success("Services added")
    },
  })
}

/** The last step: the API marks onboarding complete, and the onboarding page then opens the dashboard */
export const useSaveBankDetails = () => {
  const refreshProfile = useRefreshProfile()

  return useMutation({
    ...saveBankDetailsMutation(),
    meta: { silentError: true },
    onSuccess: async () => {
      await refreshProfile()
      toast.success("You're all set! Customers can now find and book you.")
    },
  })
}
