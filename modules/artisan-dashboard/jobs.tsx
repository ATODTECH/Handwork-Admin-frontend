"use client"

import { useState } from "react"
import { BriefcaseBusiness } from "lucide-react"
import BookingList from "@/components/account/bookings/booking-list"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMyBookings } from "@/hooks/account/use-dashboard"
import { filterJobs, sortByRecent, type JobGroup } from "@/lib/bookings"

const TABS: { value: JobGroup, label: string, empty: string }[] = [
  { value: "new", label: "New requests", empty: "No new requests. We'll notify you when a customer books you." },
  { value: "active", label: "Active", empty: "No jobs in progress." },
  { value: "done", label: "Paid", empty: "Jobs appear here once the customer has paid in full." },
  { value: "declined", label: "Declined", empty: "You haven't declined any requests." },
]

/** Every booking customers have made with this artisan, grouped by what needs doing */
const ArtisanJobs = () => {
  const { data = [], isPending, isError, refetch } = useMyBookings()
  const [tab, setTab] = useState<JobGroup>("new")
  const jobs = sortByRecent(data)
  const visible = filterJobs(jobs, tab)
  const current = TABS.find(({ value }) => value === tab)

  return (
    <>
      <PageHeader title="Job requests" description="Accept new requests with your price, then start and finish each job here." />
      <SectionCard title="Jobs" contentClassName="flex flex-col gap-5">
        <Tabs value={tab} onValueChange={(value) => setTab(value as JobGroup)}>
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <TabsList>
              {TABS.map(({ value, label }) => (
                <TabsTrigger key={value} value={value} className="gap-2 px-3">
                  {label}
                  {!isPending && (
                    <Badge variant="secondary" className="h-5 min-w-5 px-1.5 tabular-nums">
                      {filterJobs(jobs, value).length}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
        <QueryContent
          isPending={isPending}
          isError={isError}
          onRetry={refetch}
          isEmpty={!visible.length}
          empty={<EmptyState icon={BriefcaseBusiness} title={`No ${current?.label.toLowerCase()}`} description={current?.empty} />}
        >
          <BookingList bookings={visible} viewer="artisan" />
        </QueryContent>
      </SectionCard>
    </>
  )
}

export default ArtisanJobs
