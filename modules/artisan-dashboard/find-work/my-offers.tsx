"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Eye, Search, Send } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMyOffers } from "@/hooks/account/use-provider-requests"
import { formatActivityDate } from "@/lib/format"
import { formatLocation } from "@/lib/locations"
import { completionLabel } from "@/lib/offers"
import { ACCOUNT_ROUTES, artisanRequestRoute } from "@/lib/routes"
import type { OfferStatus, ProviderOffer } from "@/types/account/requests"
import ProviderOfferBadge from "./provider-offer-badge"

type Group = "open" | "accepted" | "closed"

const GROUPS: Record<Group, OfferStatus[]> = {
  open: ["SUBMITTED", "EXPIRED"],
  accepted: ["ACCEPTED"],
  closed: ["REJECTED", "WITHDRAWN"],
}

const TABS: { value: Group, label: string }[] = [
  { value: "open", label: "Waiting for the customer" },
  { value: "accepted", label: "Accepted" },
  { value: "closed", label: "Not chosen or withdrawn" },
]

const inGroup = (offers: ProviderOffer[], group: Group) => offers.filter(({ status }) => GROUPS[group].includes(status))

const FindWorkButton = () => (
  <Button render={<Link href={ACCOUNT_ROUTES.artisanFindWork} />} nativeButton={false}>
    <Search data-icon="inline-start" />
    Find work
  </Button>
)

const OfferRow = ({ offer }: { offer: ProviderOffer }) => {
  const summary = offer.request_summary
  if (!summary) return null
  const where = formatLocation(summary)
  return (
    <li>
      <Link
        href={artisanRequestRoute(summary.id)}
        className="flex items-center gap-4 rounded-xl border border-hw-border p-4 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium text-hw-grey-900">{summary.title}</span>
            <ProviderOfferBadge offer={offer} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-hw-grey-500">
            <span>{summary.customer}</span>
            {where && <span>{where}</span>}
            <span>{completionLabel(offer.completion_days)}</span>
            {offer.status === "SUBMITTED" && (
              <span className="flex items-center gap-1">
                <Eye className="size-3.5" />
                {offer.viewed_at ? "Seen" : "Not seen yet"}
              </span>
            )}
            <span>Updated {formatActivityDate(offer.updated_at)}</span>
          </div>
        </div>
        <ChevronRight className="size-4 shrink-0 text-hw-grey-500" />
      </Link>
    </li>
  )
}

/** The provider's offers, by where they stand */
const MyOffers = () => {
  const { data = [], isPending, isError, refetch } = useMyOffers()
  const [tab, setTab] = useState<Group>("open")
  const visible = inGroup(data, tab)

  return (
    <>
      <PageHeader title="My offers" description="Offers you've sent on customers' requests." actions={<FindWorkButton />} />
      <SectionCard title="Offers" contentClassName="flex flex-col gap-5">
        <Tabs value={tab} onValueChange={(value) => setTab(value as Group)}>
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <TabsList>
              {TABS.map(({ value, label }) => (
                <TabsTrigger key={value} value={value} className="gap-2 px-3">
                  {label}
                  {!isPending && (
                    <Badge variant="secondary" className="h-5 min-w-5 px-1.5 tabular-nums">
                      {inGroup(data, value).length}
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
          empty={
            <EmptyState
              icon={Send}
              title={tab === "open" ? "No offers waiting" : tab === "accepted" ? "No accepted offers yet" : "Nothing here"}
              description="Find a request for a service you offer and send your price."
              action={tab === "open" ? <FindWorkButton /> : undefined}
            />
          }
        >
          <ul className="flex flex-col gap-3">
            {visible.map((offer) => (
              <OfferRow key={offer.id} offer={offer} />
            ))}
          </ul>
        </QueryContent>
      </SectionCard>
    </>
  )
}

export default MyOffers
