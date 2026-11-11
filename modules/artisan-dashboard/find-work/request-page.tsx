"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bookmark, ClipboardX, Lock, Pencil, ShieldCheck, Undo2, Zap } from "lucide-react"
import { cn } from "cn"
import EmptyState from "@/components/account/empty-state"
import QueryContent from "@/components/account/query-content"
import ReportButton from "@/components/account/reports/report-dialog"
import ChatPanel from "@/components/account/requests/chat-panel"
import { DetailsGrid, MediaGallery, WhereAndWhen } from "@/components/account/requests/request-facts"
import SectionCard from "@/components/account/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  useMarkProviderThreadRead,
  useProviderRequest,
  useProviderThread,
  useSaveRequest,
  useSendProviderMessage,
  useWithdrawOffer,
} from "@/hooks/account/use-provider-requests"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import { isApiError } from "@/lib/http/errors"
import { completionLabel, includedLabel, NOT_STATED, validUntilLabel } from "@/lib/offers"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import type { ProviderOffer, ProviderRequest } from "@/types/account/requests"
import OfferForm from "./offer-form"
import ProviderOfferBadge from "./provider-offer-badge"

const BackToFindWork = () => (
  <Button variant="ghost" size="sm" className="-ml-2 w-fit" render={<Link href={ACCOUNT_ROUTES.artisanFindWork} />} nativeButton={false}>
    <ArrowLeft data-icon="inline-start" />
    Find work
  </Button>
)

const takesOffers = ({ stage }: ProviderRequest) => stage === "PUBLISHED" || stage === "RECEIVING_OFFERS"

const Line = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-hw-grey-500">{label}</span>
    <span className="text-right text-hw-grey-900">{value}</span>
  </div>
)

const WithdrawDialog = ({ offer, open, onOpenChange }: { offer: ProviderOffer, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const withdraw = useWithdrawOffer()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw your offer?</DialogTitle>
          <DialogDescription>The customer won&apos;t be able to accept it. You can send a new one while the request is open.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Keep it</Button>
          <Button variant="destructive" disabled={withdraw.isPending} onClick={() => withdraw.mutate(offer.id, { onSuccess: () => onOpenChange(false) })}>
            {withdraw.isPending && <Spinner data-icon="inline-start" />}
            Withdraw
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** The provider's own offer, its standing and what they can still do with it */
const YourOffer = ({ request }: { request: ProviderRequest }) => {
  const offer = request.my_offer
  const [editing, setEditing] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const open = takesOffers(request)
  const live = offer?.status === "SUBMITTED" || offer?.status === "EXPIRED"

  if (offer?.status === "ACCEPTED") {
    return (
      <SectionCard
        title="Your offer was accepted"
        description="The address is under Where and when. Once the customer pays, start the job from Job requests, and talk to them in Messages."
      >
        <div className="flex flex-wrap gap-2">
          <Button render={<Link href={ACCOUNT_ROUTES.artisanJobs} />} nativeButton={false}>Open Job requests</Button>
          <Button variant="outline" render={<Link href={ACCOUNT_ROUTES.artisanMessages} />} nativeButton={false}>Messages</Button>
        </div>
      </SectionCard>
    )
  }
  if (!open && !live) {
    return (
      <SectionCard title="Your offer">
        {offer ? (
          <div className="flex flex-col gap-2">
            <ProviderOfferBadge offer={offer} />
            {offer.rejection_note && <p className="text-sm text-hw-grey-500">{offer.rejection_note}</p>}
          </div>
        ) : (
          <p className="text-sm text-hw-grey-500">This request isn&apos;t taking offers any more.</p>
        )}
      </SectionCard>
    )
  }
  if (offer && live && !editing) {
    return (
      <SectionCard
        title="Your offer"
        description={offer.viewed_at ? `The customer saw it ${formatActivityDate(offer.viewed_at)}.` : "The customer hasn't opened it yet."}
        action={<ProviderOfferBadge offer={offer} withPrice={false} />}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-xl border border-hw-border p-4">
            <Line label="Price" value={`${formatNairaAmount(offer.price)}${offer.is_estimate ? " (estimate)" : ""}`} />
            <Line label="Ready in" value={completionLabel(offer.completion_days)} />
            <Line label="Materials" value={includedLabel(offer.materials_included)} />
            <Line label="Labour" value={includedLabel(offer.labour_included)} />
            <Line label="Warranty" value={offer.warranty || NOT_STATED} />
            <Line label="Valid until" value={validUntilLabel(offer.valid_until)} />
          </div>
          {offer.status === "EXPIRED" && (
            <p className="text-sm text-hw-text-warning">Your offer has expired. Update it with a new date so the customer can accept it.</p>
          )}
          {open && (
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setEditing(true)}>
                <Pencil data-icon="inline-start" />
                Update offer
              </Button>
              <Button variant="ghost" onClick={() => setWithdrawing(true)}>
                <Undo2 data-icon="inline-start" />
                Withdraw
              </Button>
            </div>
          )}
        </div>
        <WithdrawDialog offer={offer} open={withdrawing} onOpenChange={setWithdrawing} />
      </SectionCard>
    )
  }
  return (
    <SectionCard
      title={offer && live ? "Update your offer" : offer ? "Send a new offer" : "Send an offer"}
      description={
        offer && live
          ? "The customer is told and can see what you changed."
          : "Be clear about what's included. Customers compare offers side by side, not only on price."
      }
      action={editing ? <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button> : undefined}
    >
      <OfferForm requestId={request.id} offer={offer} onDone={() => setEditing(false)} />
    </SectionCard>
  )
}

/** Questions for the customer before (or after) offering */
const CustomerChat = ({ request }: { request: ProviderRequest }) => {
  const [open, setOpen] = useState(false)
  const thread = useProviderThread(request.id, open)
  const send = useSendProviderMessage()
  const { mutate: markRead, isPending: marking } = useMarkProviderThreadRead()
  const onUnread = useCallback(() => {
    if (!marking) markRead(request.id)
  }, [marking, markRead, request.id])
  const name = request.customer.first_name

  return (
    <SectionCard
      title={`Questions for ${name}`}
      description="Ask anything you need to give an accurate price. Contact details stay private until a booking is paid."
    >
      {open ? (
        <ChatPanel
          className="h-96"
          thread={thread.data}
          isPending={thread.isPending}
          isError={thread.isError}
          onRetry={thread.refetch}
          onSend={(text, done) => send.mutate({ requestId: request.id, text }, { onSuccess: done })}
          sending={send.isPending}
          sendError={send.error?.message ?? null}
          onUnread={onUnread}
          emptyText={`Ask ${name} about the job.`}
        />
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)}>Open the chat</Button>
      )}
    </SectionCard>
  )
}

const RequestView = ({ request }: { request: ProviderRequest }) => {
  const save = useSaveRequest()

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <Card className="gap-4 rounded-2xl p-6 shadow-none ring-hw-border">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-hw-grey-500">{request.reference}</span>
            {request.private && <Badge className="bg-[#EFF5FF] text-hw-secondary"><Lock /> Sent to you</Badge>}
            {request.urgency === "URGENT" && <Badge className="bg-[#FFF0EF] text-[#C2271D]"><Zap /> Urgent</Badge>}
            {!takesOffers(request) && !request.my_offer && <Badge variant="secondary">No longer taking offers</Badge>}
          </div>
          <div className="flex items-center gap-1">
            <ReportButton target={{ type: "REQUEST", id: request.id }} subject={`${request.customer.first_name}'s request`} />
            <Button variant="outline" size="sm" disabled={save.isPending} onClick={() => save.mutate({ id: request.id, saved: !request.saved })}>
              <Bookmark data-icon="inline-start" className={cn(request.saved && "fill-hw-secondary text-hw-secondary")} />
              {request.saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-hw-grey-900">{request.title}</h1>
        <p className="text-sm text-hw-grey-500">
          From {request.customer.first_name}
          {request.published_at && ` · posted ${formatActivityDate(request.published_at)}`}
          {` · ${request.offer_count} ${request.offer_count === 1 ? "offer" : "offers"} so far`}
        </p>
      </Card>

      <SectionCard title="What they need">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-1.5">
            {request.category && <Badge variant="outline">{request.category.name}</Badge>}
            {request.services.map(({ id, name }) => (
              <Badge key={id} variant="secondary">{name}</Badge>
            ))}
          </div>
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
        <WhereAndWhen request={request} addressHint="You'll see the exact address if your offer is accepted." />
      </SectionCard>

      <YourOffer request={request} />
      {/* Once their offer is accepted, the conversation carries on in the booking's chat */}
      {request.my_offer?.status !== "ACCEPTED" && <CustomerChat request={request} />}

      <p className="flex items-start gap-2 text-xs text-hw-grey-500">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-hw-secondary" />
        Customers pay Handwork Expert, and we hold the money until they confirm the job is done. Don&apos;t take payment outside the
        platform: we can only protect payments made here.
      </p>
    </div>
  )
}

const PageSkeleton = () => (
  <div className="mx-auto flex w-full max-w-4xl flex-col gap-6" aria-busy="true" aria-label="Loading">
    <Skeleton className="h-40 rounded-2xl" />
    <Skeleton className="h-[28rem] rounded-2xl" />
  </div>
)

/** A customer's request as a provider sees it, with their offer and the chat */
const ProviderRequestPage = ({ id }: { id: number }) => {
  const { data: request, isPending, isError, error, refetch } = useProviderRequest(id)
  const status = isError && isApiError(error) ? error.status : null

  return (
    <>
      <BackToFindWork />
      {status === 404 || status === 403 ? (
        <EmptyState
          icon={ClipboardX}
          title={status === 403 ? "Requests open up once you're approved" : "This request isn't available"}
          description={status === 403 ? "Our team is reviewing your account." : "It may have been closed, or it was sent to another provider."}
        />
      ) : (
        <QueryContent isPending={isPending} isError={isError} onRetry={refetch} isEmpty={!request} empty={null} skeleton={<PageSkeleton />}>
          {request && <RequestView request={request} />}
        </QueryContent>
      )}
    </>
  )
}

export default ProviderRequestPage
