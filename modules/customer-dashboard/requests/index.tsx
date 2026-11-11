"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, ClipboardList, Film, ImageIcon, MapPin, Plus } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMyRequests } from "@/hooks/account/use-requests"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import { formatLocation } from "@/lib/locations"
import { budgetLabel, filterRequests, type RequestGroup } from "@/lib/requests"
import { ACCOUNT_ROUTES, customerRequestRoute } from "@/lib/routes"
import type { JobRequest } from "@/types/account/requests"
import RequestStageBadge from "./request-stage-badge"

const TABS: { value: RequestGroup, label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "booked", label: "Booked" },
  { value: "done", label: "Completed" },
  { value: "closed", label: "Closed" },
]

export const PostRequestButton = ({ label = "Post a request" }: { label?: string }) => (
  <Button render={<Link href={ACCOUNT_ROUTES.customerNewRequest} />} nativeButton={false}>
    <Plus data-icon="inline-start" />
    {label}
  </Button>
)

const RequestRow = ({ request }: { request: JobRequest }) => {
  const images = request.attachments.filter(({ kind }) => kind === "IMAGE").length
  const videos = request.attachments.length - images
  const where = request.fulfilment === "REMOTE" ? "Remote" : formatLocation(request)

  return (
    <li>
      <Link
        href={customerRequestRoute(request.id)}
        className="flex items-center gap-4 rounded-xl border border-hw-border p-4 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium text-hw-grey-900">{request.title}</span>
            <RequestStageBadge stage={request.stage} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-hw-grey-500">
            <span>{request.reference}</span>
            <span>{budgetLabel(request, formatNairaAmount)}</span>
            {where && (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {where}
              </span>
            )}
            {images > 0 && (
              <span className="flex items-center gap-1">
                <ImageIcon className="size-3.5" />
                {images}
              </span>
            )}
            {videos > 0 && (
              <span className="flex items-center gap-1">
                <Film className="size-3.5" />
                {videos}
              </span>
            )}
            <span>{formatActivityDate(request.published_at ?? request.created_at)}</span>
          </div>
        </div>
        {request.status === "OPEN" && (
          <Badge variant="secondary" className="shrink-0 tabular-nums">
            {request.offer_count} {request.offer_count === 1 ? "offer" : "offers"}
          </Badge>
        )}
        <ChevronRight className="size-4 shrink-0 text-hw-grey-500" />
      </Link>
    </li>
  )
}

/** The customer's requests, by where they stand */
const CustomerRequests = () => {
  const { data = [], isPending, isError, refetch } = useMyRequests()
  const [tab, setTab] = useState<RequestGroup>("all")
  const visible = filterRequests(data, tab)
  const tabLabel = TABS.find(({ value }) => value === tab)?.label.toLowerCase()

  return (
    <>
      <PageHeader
        title="My requests"
        description="Describe what you need once, get offers from artisans, and pick the best one."
        actions={<PostRequestButton />}
      />
      <SectionCard title="Requests" contentClassName="flex flex-col gap-5">
        <Tabs value={tab} onValueChange={(value) => setTab(value as RequestGroup)}>
          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <TabsList>
              {TABS.map(({ value, label }) => (
                <TabsTrigger key={value} value={value} className="gap-2 px-3">
                  {label}
                  {!isPending && (
                    <Badge variant="secondary" className="h-5 min-w-5 px-1.5 tabular-nums">
                      {filterRequests(data, value).length}
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
              icon={ClipboardList}
              title={tab === "all" ? "No requests yet" : `No ${tabLabel} requests`}
              description="Post what you need, with photos or a video, and artisans will send you offers to compare."
              action={tab === "all" ? <PostRequestButton /> : undefined}
            />
          }
        >
          <ul className="flex flex-col gap-3">
            {visible.map((request) => (
              <RequestRow key={request.id} request={request} />
            ))}
          </ul>
        </QueryContent>
      </SectionCard>
    </>
  )
}

export default CustomerRequests
