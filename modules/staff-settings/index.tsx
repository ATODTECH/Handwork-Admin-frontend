"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import { useStaffMe } from "@/hooks/admin/use-staff"
import ProfilePanel from "./profile-panel"
import StaffPanel from "./staff-panel"

type Tab = "profile" | "staff"

/** The staff member's own profile and password, and the staff list (managed by admins) */
const StaffSettingsIndex = () => {
  const heading = usePageHeading()
  const [tab, setTab] = useState<Tab>("profile")
  const { data: me, isPending, isError, refetch } = useStaffMe()

  return (
    <section className="flex flex-col gap-6">
      <PageHeader title={heading?.title ?? "Settings"} description={heading?.description ?? "Your profile and your team."} action={null} />
      <FilterTabs
        label="Settings"
        tabs={[
          { label: "My profile", value: "profile" },
          { label: "Staff", value: "staff" },
        ]}
        value={tab}
        onChange={setTab}
        className="w-fit"
      />
      {isPending ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : isError || !me ? (
        <EmptyState icon={Settings} title="Couldn't load your settings" description="Check your connection and try again." action={<Button onClick={() => refetch()}>Try again</Button>} />
      ) : tab === "profile" ? (
        <ProfilePanel me={me} />
      ) : (
        <StaffPanel isAdmin={me.role === "ADMIN"} />
      )}
    </section>
  )
}

export default StaffSettingsIndex
