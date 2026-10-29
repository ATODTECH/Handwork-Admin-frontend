"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import BookingList from "@/components/account/bookings/booking-list"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMyBookings } from "@/hooks/account/use-dashboard"
import { filterByGroup, sortByRecent, type BookingGroup } from "@/lib/bookings"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import NoBookingsYet from "./no-bookings-yet"

const TABS: { value: BookingGroup | "all", label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "action", label: "Needs your action" },
  { value: "done", label: "Completed" },
  { value: "declined", label: "Declined" },
]

const CustomerBookings = () => {
  const { data = [], isPending, isError, refetch } = useMyBookings()
  const [tab, setTab] = useState<BookingGroup | "all">("all")
  const bookings = sortByRecent(data)
  const visible = filterByGroup(bookings, tab)
  const tabLabel = TABS.find(({ value }) => value === tab)?.label.toLowerCase()

  return (
    <>
      <PageHeader
        title="My bookings"
        description="Track every request, pay deposits and balances, and see what's next."
        actions={
          <Button render={<Link href={ACCOUNT_ROUTES.customerArtisans} />} nativeButton={false}>
            <Plus data-icon="inline-start" />
            New booking
          </Button>
        }
      />
      <SectionCard title="Bookings" contentClassName="flex flex-col gap-5">
        <Tabs value={tab} onValueChange={(value) => setTab(value as BookingGroup | "all")}>
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <TabsList>
              {TABS.map(({ value, label }) => (
                <TabsTrigger key={value} value={value} className="gap-2 px-3">
                  {label}
                  {!isPending && (
                    <Badge variant="secondary" className="h-5 min-w-5 px-1.5 tabular-nums">
                      {filterByGroup(bookings, value).length}
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
          empty={<NoBookingsYet title={tab === "all" ? "No bookings yet" : `No ${tabLabel} bookings`} />}
        >
          <BookingList bookings={visible} />
        </QueryContent>
      </SectionCard>
    </>
  )
}

export default CustomerBookings
