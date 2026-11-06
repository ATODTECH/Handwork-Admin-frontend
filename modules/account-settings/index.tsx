"use client"

import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAccountDetails } from "@/hooks/account/use-profile"
import DeleteSection from "./delete-section"
import DetailsForm from "./details-form"
import PasswordSection from "./password-section"
import PhotoSection from "./photo-section"
import WorkSection from "./work-section"

const SettingsSkeleton = () => (
  <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading">
    <Skeleton className="h-36 rounded-2xl" />
    <Skeleton className="h-96 rounded-2xl" />
  </div>
)

/** The signed-in customer's or artisan's own account */
const AccountSettings = () => {
  const { data: details, isPending, isError, refetch, role } = useAccountDetails()

  return (
    <>
      <PageHeader title="Profile & settings" description="Keep your details up to date and manage your account." />

      <QueryContent isPending={isPending} isError={isError} onRetry={refetch} isEmpty={!details} empty={null} skeleton={<SettingsSkeleton />}>
        {details && (
          <div className="flex max-w-3xl flex-col gap-6">
            <SectionCard title="Profile photo">
              <PhotoSection details={details} />
            </SectionCard>
            <SectionCard title="Your details">
              <DetailsForm details={details} isArtisan={role === "ARTISAN"} />
            </SectionCard>
            {role === "ARTISAN" && details.skill && (
              <SectionCard title="Your services" description="What customers see on your profile: services, prices, work days and photos.">
                <WorkSection skill={details.skill} />
              </SectionCard>
            )}
            <SectionCard title="Password">
              <PasswordSection email={details.email} />
            </SectionCard>
            <SectionCard title="Delete account">
              <DeleteSection />
            </SectionCard>
          </div>
        )}
      </QueryContent>
    </>
  )
}

export default AccountSettings
