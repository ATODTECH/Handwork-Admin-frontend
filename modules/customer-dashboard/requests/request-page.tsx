"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ClipboardX, Lock, Pencil, RotateCw, Send, Trash2 } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import { DetailsGrid, MediaGallery, WhereAndWhen } from "@/components/account/requests/request-facts"
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
import { formatActivityDate } from "@/lib/format"
import { isApiError } from "@/lib/http/errors"
import { isEditable, STAGE_META } from "@/lib/requests"
import { ACCOUNT_ROUTES, customerEditRequestRoute } from "@/lib/routes"
import type { JobRequest } from "@/types/account/requests"
import OffersSection from "./offers/offers-section"
import RequestStageBadge from "./request-stage-badge"

const CLOSE_REASONS = ["I found someone else", "I don't need it any more", "The offers were too expensive"]

export const BackToRequests = () => (
  <Button variant="ghost" size="sm" className="-ml-2 w-fit" render={<Link href={ACCOUNT_ROUTES.customerRequests} />} nativeButton={false}>
    <ArrowLeft data-icon="inline-start" />
    My requests
  </Button>
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

/** Once an offer is accepted, the booking carries on in My bookings */
const BookingCard = ({ request }: { request: JobRequest }) => (
  <SectionCard title="Booking" description={STAGE_META[request.stage].hint}>
    <Button render={<Link href={ACCOUNT_ROUTES.customerBookings} />} nativeButton={false}>
      Open My bookings
    </Button>
  </SectionCard>
)

const RequestDetails = ({ request }: { request: JobRequest }) => {
  const { data: categories = [] } = useCategories()
  const category = categories.find(({ id }) => id === request.category)
  const services = category?.service.filter(({ id }) => request.services.includes(id)).map(({ name }) => name) ?? []

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

      {request.booking_id && <BookingCard request={request} />}
      {request.status !== "DRAFT" && !request.booking_id && <OffersSection request={request} />}

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
          <DetailsGrid details={request.details} />
        </div>
      </SectionCard>

      {request.attachments.length > 0 && (
        <SectionCard title="Photos and videos">
          <MediaGallery attachments={request.attachments} />
        </SectionCard>
      )}

      <SectionCard title="Where and when">
        <WhereAndWhen request={request} />
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
  <div className="mx-auto flex w-full max-w-4xl flex-col gap-6" aria-busy="true" aria-label="Loading">
    <Skeleton className="h-48 rounded-2xl" />
    <Skeleton className="h-[28rem] rounded-2xl" />
  </div>
)

/** One of the customer's requests: where it stands, its offers, and what was asked for */
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
            <div className="mx-auto w-full max-w-4xl">
              <RequestDetails request={request} />
            </div>
          )}
        </QueryContent>
      )}
    </>
  )
}

export default RequestPage
