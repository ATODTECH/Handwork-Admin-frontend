"use client"

import { Hourglass, TriangleAlert } from "lucide-react"
import SectionCard from "@/components/account/section-card"
import VerificationBadge from "@/components/shared/verification-badge"
import { useOnboardingProgress } from "@/hooks/account/use-artisan-onboarding"
import IdentityStep from "./onboarding/identity-step"

/**
 * Where the artisan stands with staff review. Nothing shows once approved; when changes are
 * requested, re-uploading the ID sends them back for review.
 */
const VerificationStatus = () => {
  const { data: profile } = useOnboardingProgress()
  if (!profile || profile.verification_status === "APPROVED") return null

  if (profile.verification_status === "PENDING") {
    return (
      <SectionCard title="Your profile is being reviewed" action={<VerificationBadge status="PENDING" />}>
        <p className="flex gap-3 text-sm leading-relaxed text-hw-grey-700">
          <Hourglass className="mt-0.5 size-4 shrink-0 text-hw-secondary" />
          Our team is checking your ID and work details. Customers will be able to find and book you once you&apos;re
          approved; we&apos;ll email you as soon as that happens.
        </p>
      </SectionCard>
    )
  }

  return (
    <SectionCard
      title="We need a few changes"
      description="Update your details below and we'll review your profile again."
      action={<VerificationBadge status="REJECTED" />}
    >
      <div className="flex flex-col gap-6">
        {profile.verification_note && (
          <p role="alert" className="flex gap-3 rounded-lg bg-[#FFF0EF] px-3 py-2.5 text-sm text-[#C2271D]">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            {profile.verification_note}
          </p>
        )}
        <IdentityStep />
      </div>
    </SectionCard>
  )
}

export default VerificationStatus
