"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileCheck2, Landmark, MapPin, Wrench, type LucideIcon } from "lucide-react"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import Stepper, { type StepStatus } from "@/components/account/stepper"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ONBOARDING_STEP_IDS, useOnboardingProgress, type OnboardingStepId } from "@/hooks/account/use-artisan-onboarding"
import { markAccountOnboarded } from "@/hooks/site/use-auth"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import IdentityStep from "./identity-step"
import LocationStep from "./location-step"
import PayoutStep from "./payout-step"
import ServicesStep from "./services-step"

interface StepConfig {
  icon: LucideIcon
  title: string
  description: string
  /** Shown above the form while this step is the current one */
  intro: string
  Form: React.ComponentType
}

const STEPS: Record<OnboardingStepId, StepConfig> = {
  identity: {
    icon: FileCheck2,
    title: "Upload your ID",
    description: "Your NIN and a driver's licence, passport or NIN slip.",
    intro: "We use these to verify who you are. They're never shown to customers.",
    Form: IdentityStep,
  },
  location: {
    icon: MapPin,
    title: "Add your location",
    description: "The state and area you work in.",
    intro: "Customers look for artisans near them, so tell us where you're based.",
    Form: LocationStep,
  },
  services: {
    icon: Wrench,
    title: "Add your services",
    description: "What you do, your price range and photos of past work.",
    intro: "This is what customers see when they look for an artisan.",
    Form: ServicesStep,
  },
  payout: {
    icon: Landmark,
    title: "Add bank details",
    description: "Where we send your earnings after each job.",
    intro: "Use an account in your own name so payouts aren't held up.",
    Form: PayoutStep,
  },
}

const OnboardingSkeleton = () => (
  <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]" aria-busy="true" aria-label="Loading">
    <Skeleton className="h-72 rounded-2xl" />
    <Skeleton className="h-[28rem] rounded-2xl" />
  </div>
)

/** The setup steps an artisan finishes before getting jobs */
const ArtisanOnboarding = () => {
  const router = useRouter()
  const { isPending, isError, refetch, completed, current, completedCount } = useOnboardingProgress()
  const total = ONBOARDING_STEP_IDS.length
  // Bank details complete onboarding on the API, e.g. when set up from the mobile app
  const finished = !!completed?.payout

  useEffect(() => {
    if (!finished) return
    markAccountOnboarded()
    router.replace(ACCOUNT_ROUTES.artisanHome)
  }, [finished, router])

  const statusOf = (id: OnboardingStepId): StepStatus =>
    completed?.[id] ? "complete" : id === current ? "current" : "upcoming"
  const active = current && !finished ? { id: current, ...STEPS[current] } : null

  return (
    <>
      <PageHeader title="Finish setting up" description="Four quick steps before you can start getting jobs." />

      <QueryContent isPending={isPending} isError={isError} onRetry={refetch} isEmpty={false} empty={null} skeleton={<OnboardingSkeleton />}>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <SectionCard title="Your setup checklist" className="lg:sticky lg:top-24">
            <div className="flex flex-col gap-6">
              <Progress value={(completedCount / total) * 100} className="gap-2">
                <ProgressLabel className="text-xs font-medium text-hw-grey-700">
                  {completedCount} of {total} done
                </ProgressLabel>
                <ProgressValue className="ml-auto text-xs text-hw-grey-500" />
              </Progress>
              <Stepper steps={ONBOARDING_STEP_IDS.map((id) => ({ id, ...STEPS[id], status: statusOf(id) }))} />
            </div>
          </SectionCard>

          {active && (
            <SectionCard
              // Remount per step, so each form starts fresh
              key={active.id}
              title={active.title}
              description={active.intro}
              action={
                <span className="text-xs font-medium text-hw-grey-500">
                  Step {ONBOARDING_STEP_IDS.indexOf(active.id) + 1} of {total}
                </span>
              }
            >
              <active.Form />
            </SectionCard>
          )}
        </div>
      </QueryContent>
    </>
  )
}

export default ArtisanOnboarding
