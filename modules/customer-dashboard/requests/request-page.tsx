"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarDays, ClipboardX, Film, Lock, MapPin, Pencil, RotateCw, Send, Timer, Trash2, Wallet } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import ReasonDialog from "@/components/shared/reason-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useCategories } from "@/hooks/account/use-marketplace"
import { useCloseRequest, useDeleteRequest, usePublishRequest, useRequest } from "@/hooks/account/use-requests"
import { formatActivityDate, formatNairaAmount, formatSchedule } from "@/lib/format"
import { isApiError } from "@/lib/http/errors"
import { formatLocation } from "@/lib/locations"
import { budgetLabel, FULFILMENT_OPTIONS, isEditable, STAGE_META, urgencyLabel } from "@/lib/requests"
import { ACCOUNT_ROUTES, customerEditRequestRoute } from "@/lib/routes"
import type { JobRequest, RequestAttachment } from "@/types/account/requests"
import RequestStageBadge from "./request-stage-badge"

const CLOSE_REASONS = ["I found someone else", "I don't need it any more", "The offers were too expensive"]

export const BackToRequests = () => (
  <Button variant="ghost" size="sm" className="-ml-2 w-fit" render={<Link href={ACCOUNT_ROUTES.customerRequests} />} nativeButton={false}>
    <ArrowLeft data-icon="inline-start" />
    My requests
  </Button>
)

const Fact = ({ icon: Icon, label, children }: { icon: typeof MapPin, label: string, children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-hw-grey-700">
      <Icon className="size-4" />
    </span>
    <div className="flex min-w-0 flex-col">
      <span className="text-xs text-hw-grey-500">{label}</span>
      <span className="text-sm text-hw-grey-900">{children}</span>
    </div>
  </div>
)

const MediaGallery = ({ attachments }: { attachments: RequestAttachment[] }) => (
  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
    {attachments.map((attachment, index) => (
      <li key={attachment.id} className="relative aspect-4/3 overflow-hidden rounded-xl border border-hw-border bg-muted">
        {attachment.url && attachment.kind === "IMAGE" && (
          <a href={attachment.url} target="_blank" rel="noreferrer" className="block size-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- a signed storage link */}
            <img src={attachment.url} alt={`Photo ${index + 1}`} className="size-full object-cover" />
          </a>
        )}
        {attachment.url && attachment.kind === "VIDEO" && (
          <video src={attachment.url} controls playsInline preload="metadata" className="size-full bg-black object-contain" aria-label={`Video ${index + 1}`} />
        )}
        <div className="pointer-events-none absolute top-2 left-2 flex gap-1">
          {attachment.kind === "VIDEO" && (
            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">
              <Film className="size-3" /> Video
            </span>
          )}
          {attachment.private && (
            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">
              <Lock className="size-3" /> Private
            </span>
          )}
        </div>
      </li>
    ))}
  </ul>
)

const DeleteDraftDialog = ({ request, open, onOpenChange }: { request: JobRequest, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const remove = useDeleteRequest()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this draft?</DialogTitle>
          <DialogDescription>&ldquo;{request.title}&rdquo; and its photos and videos will be deleted. This can&apos;t be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Keep it</Button>
          <Button variant="destructive" disabled={remove.isPending} onClick={() => remove.mutate(request.id)}>
            {remove.isPending && <Spinner data-icon="inline-start" />}
            Delete draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const RequestActions = ({ request }: { request: JobRequest }) => {
  const publish = usePublishRequest()
  const close = useCloseRequest()
  const [closing, setClosing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  return (
    <div className="flex flex-wrap gap-2">
      {isEditable(request) && (
        <Button variant="outline" render={<Link href={customerEditRequestRoute(request.id)} />} nativeButton={false}>
          <Pencil data-icon="inline-start" />
          Edit
        </Button>
      )}
      {(request.stage === "DRAFT" || request.stage === "EXPIRED") && (
        <Button disabled={publish.isPending} onClick={() => publish.mutate(request.id)}>
          {publish.isPending ? <Spinner data-icon="inline-start" /> : request.stage === "DRAFT" ? <Send data-icon="inline-start" /> : <RotateCw data-icon="inline-start" />}
          {request.stage === "DRAFT" ? "Publish" : "Renew for 30 days"}
        </Button>
      )}
      {request.status === "OPEN" && (
        <Button variant="outline" onClick={() => setClosing(true)}>
          <ClipboardX data-icon="inline-start" />
          Close request
        </Button>
      )}
      {request.status === "DRAFT" && (
        <Button variant="ghost" className="text-[#C2271D]" onClick={() => setDeleting(true)}>
          <Trash2 data-icon="inline-start" />
          Delete draft
        </Button>
      )}

      <ReasonDialog
        open={closing}
        onOpenChange={setClosing}
        title="Close this request?"
        description="Providers won't be able to send offers, and any offers you have are turned down."
        quickReasons={CLOSE_REASONS}
        placeholder="Why are you closing it? (optional)"
        submitLabel="Close request"
        cancelLabel="Keep it open"
        minLength={0}
        pending={close.isPending}
        onSubmit={(reason, done) => close.mutate({ id: request.id, reason }, { onSuccess: done })}
      />
      <DeleteDraftDialog request={request} open={deleting} onOpenChange={setDeleting} />
    </div>
  )
}

const OffersSummary = ({ request }: { request: JobRequest }) => {
  if (request.booking_id) {
    return (
      <SectionCard title="Booking" description={STAGE_META[request.stage].hint}>
        <Button render={<Link href={ACCOUNT_ROUTES.customerBookings} />} nativeButton={false}>
          Open My bookings
        </Button>
      </SectionCard>
    )
  }
  if (request.status === "DRAFT" || request.status === "CLOSED") return null
  return (
    <SectionCard title="Offers">
      <p className="text-3xl font-semibold tabular-nums text-hw-grey-900">{request.offer_count}</p>
      <p className="text-sm text-hw-grey-500">{request.offer_count === 1 ? "offer so far" : "offers so far"}</p>
    </SectionCard>
  )
}

const RequestDetails = ({ request }: { request: JobRequest }) => {
  const { data: categories = [] } = useCategories()
  const category = categories.find(({ id }) => id === request.category)
  const services = category?.service.filter(({ id }) => request.services.includes(id)).map(({ name }) => name) ?? []
  const fulfilment = FULFILMENT_OPTIONS.find(({ value }) => value === request.fulfilment)?.label
  const where = request.fulfilment === "REMOTE" ? "Remote" : [request.address, formatLocation(request)].filter(Boolean).join(", ")
  const details = Object.entries(request.details)

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <Card className="gap-4 rounded-2xl p-6 shadow-none ring-hw-border">
        <div className="flex flex-wrap items-center gap-2">
          <RequestStageBadge stage={request.stage} />
          <span className="text-xs text-hw-grey-500">{request.reference}</span>
          {request.visibility === "PRIVATE" && <Badge variant="secondary"><Lock className="size-3" /> Private request</Badge>}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-hw-grey-900">{request.title}</h1>
        <p className="text-sm text-hw-grey-500">{STAGE_META[request.stage].hint}</p>
        {request.close_reason && <p className="text-sm text-hw-grey-700">Reason: {request.close_reason}</p>}
        <RequestActions request={request} />
      </Card>

      <SectionCard title="What you need">
        <div className="flex flex-col gap-5">
          {(category || services.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {category && <Badge variant="outline">{category.name}</Badge>}
              {services.map((service) => (
                <Badge key={service} variant="secondary">{service}</Badge>
              ))}
            </div>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-line text-hw-grey-700">{request.description}</p>
          {details.length > 0 && (
            <dl className="grid gap-3 sm:grid-cols-2">
              {details.map(([key, value]) => (
                <div key={key} className="rounded-lg bg-muted/60 px-3 py-2">
                  <dt className="text-xs text-hw-grey-500">{key}</dt>
                  <dd className="text-sm text-hw-grey-900">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </SectionCard>

      {request.attachments.length > 0 && (
        <SectionCard title="Photos and videos">
          <MediaGallery attachments={request.attachments} />
        </SectionCard>
      )}

      <SectionCard title="Where and when">
        <div className="grid gap-5 sm:grid-cols-2">
          <Fact icon={MapPin} label={fulfilment ?? "Where"}>{where || "Not set"}</Fact>
          <Fact icon={Wallet} label="Budget">{budgetLabel(request, formatNairaAmount)}</Fact>
          <Fact icon={CalendarDays} label="Needed by">{request.deadline ? formatSchedule(request.deadline) : "No date set"}</Fact>
          <Fact icon={Timer} label="Urgency">{urgencyLabel(request.urgency)}</Fact>
        </div>
        {request.published_at && (
          <p className="mt-5 text-xs text-hw-grey-500">
            Published {formatActivityDate(request.published_at)}
            {request.expires_at && request.status === "OPEN" && ` · takes offers until ${formatActivityDate(request.expires_at)}`}
          </p>
        )}
      </SectionCard>
    </div>
  )
}

const PageSkeleton = () => (
  <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]" aria-busy="true" aria-label="Loading">
    <Skeleton className="h-[36rem] rounded-2xl" />
    <Skeleton className="h-48 rounded-2xl" />
  </div>
)

/** One of the customer's requests: what they asked for, where it stands and its offers */
const RequestPage = ({ id }: { id: number }) => {
  const { data: request, isPending, isError, error, refetch } = useRequest(id)
  const notFound = isError && isApiError(error) && error.status === 404

  return (
    <>
      <BackToRequests />
      {notFound ? (
        <EmptyState icon={ClipboardX} title="We couldn't find this request" description="It may have been deleted." />
      ) : (
        <QueryContent isPending={isPending} isError={isError} onRetry={refetch} isEmpty={!request} empty={null} skeleton={<PageSkeleton />}>
          {request && (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
              <RequestDetails request={request} />
              <div className="flex flex-col gap-6 lg:sticky lg:top-24">
                <OffersSummary request={request} />
              </div>
            </div>
          )}
        </QueryContent>
      )}
    </>
  )
}

export default RequestPage
