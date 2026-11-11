"use client"

import { useState } from "react"
import Link from "next/link"
import { Ban, Undo2 } from "lucide-react"
import { DetailsGrid, MediaGallery, WhereAndWhen } from "@/components/account/requests/request-facts"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { DetailRow, DetailSection } from "@/components/shared/details-part"
import ReasonDialog from "@/components/shared/reason-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminRequest, useCloseRequest, useWithdrawOffer } from "@/hooks/admin/use-requests"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import { completionLabel, includedLabel, NOT_STATED, OFFER_STATUS, validUntilLabel } from "@/lib/offers"
import { ROUTES } from "@/lib/routes"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { OfferForStaff, RequestDetailForStaff } from "@/types/admin/requests"
import { ReportsBadge, StaffStageBadge } from "./columns"

const QUICK_REASONS = [
  "Asking to pay outside Handwork Expert",
  "Contact details or advertising in the listing",
  "Something we don't allow on Handwork Expert",
  "Fake, duplicate or misleading",
]

const Text = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[13px] leading-relaxed whitespace-pre-line text-[#626773]">{children}</p>
)

const OfferRow = ({ offer, onWithdraw }: { offer: OfferForStaff, onWithdraw: () => void }) => {
  const { label, tone } = OFFER_STATUS[offer.status]
  return (
    <li className="flex flex-col gap-2 rounded-xl border border-hw-border p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <span className="text-sm font-semibold text-hw-grey-900">{offer.provider.name}</span>
          <span className="truncate text-xs text-hw-grey-500">{offer.provider.email} · sent {formatActivityDate(offer.created_at)}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-semibold text-hw-grey-900 tabular-nums">
            {formatNairaAmount(offer.price)}
            {offer.is_estimate && <span className="font-normal text-hw-grey-500"> (estimate)</span>}
          </span>
          <Badge className={SEMANTIC_TONES[tone].chip}>{label}</Badge>
        </div>
      </div>
      <Text>{offer.description}</Text>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {[
          ["Ready in", completionLabel(offer.completion_days)],
          ["Materials", includedLabel(offer.materials_included)],
          ["Warranty", offer.warranty || NOT_STATED],
          ["Valid until", validUntilLabel(offer.valid_until)],
          ["Extra charges", offer.additional_charges || "None stated"],
          ["Revised", offer.revision_count ? `${offer.revision_count}×` : "No"],
        ].map(([term, value]) => (
          <div key={term} className="flex justify-between gap-2">
            <dt className="text-hw-grey-500">{term}</dt>
            <dd className="truncate text-right text-hw-grey-900">{value}</dd>
          </div>
        ))}
      </dl>
      {offer.rejection_note && <span className="text-xs text-hw-grey-500">Note: {offer.rejection_note}</span>}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ReportsBadge count={offer.open_reports} />
        {offer.status === "SUBMITTED" && (
          <Button variant="outline" size="sm" className="ml-auto" onClick={onWithdraw}>
            <Undo2 data-icon="inline-start" />
            Withdraw offer
          </Button>
        )}
      </div>
    </li>
  )
}

const RequestDetails = ({ request }: { request: RequestDetailForStaff }) => {
  const [closing, setClosing] = useState(false)
  const [withdrawing, setWithdrawing] = useState<OfferForStaff | null>(null)
  const close = useCloseRequest()
  const withdraw = useWithdrawOffer()
  const closable = request.status === "DRAFT" || request.status === "OPEN"
  const offers = [...request.offers].sort((a, b) => Number(b.status === "SUBMITTED") - Number(a.status === "SUBMITTED"))

  return (
    <div className="divide-y divide-hw-grey-200">
      <div className="flex flex-col gap-2 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-lg font-semibold text-hw-grey-900">{request.title}</span>
            <span className="text-xs text-hw-grey-500">
              {request.reference} · {request.services.join(", ") || request.category}
              {request.visibility === "PRIVATE" && " · private"}
            </span>
          </div>
          <StaffStageBadge stage={request.stage} />
        </div>
        <ReportsBadge count={request.open_reports} />
      </div>

      {request.close_reason && (
        <DetailSection title="Why it was closed">
          <Text>{request.close_reason}</Text>
        </DetailSection>
      )}

      <DetailSection title="What they need">
        <div className="flex flex-col gap-4">
          <Text>{request.description}</Text>
          <DetailsGrid details={request.details} />
          {request.attachments.length > 0 && <MediaGallery attachments={request.attachments} />}
        </div>
      </DetailSection>

      <DetailSection title="Where and when">
        <WhereAndWhen request={request} />
      </DetailSection>

      <DetailSection title="Customer">
        <DetailRow label="Name">{request.customer.name}</DetailRow>
        <DetailRow label="Email">{request.customer.email}</DetailRow>
        <DetailRow label="Account">{request.customer.is_active ? "Active" : "Deactivated"}</DetailRow>
        {request.target_provider && <DetailRow label="Sent only to">{request.target_provider.name}</DetailRow>}
      </DetailSection>

      <DetailSection title="Timeline">
        <DetailRow label="Started">{formatActivityDate(request.created_at)}</DetailRow>
        {request.published_at && <DetailRow label="Posted">{formatActivityDate(request.published_at)}</DetailRow>}
        {request.expires_at && request.status === "OPEN" && <DetailRow label="Stops taking offers">{formatActivityDate(request.expires_at)}</DetailRow>}
        {request.closed_at && <DetailRow label="Closed">{formatActivityDate(request.closed_at)}</DetailRow>}
      </DetailSection>

      <DetailSection title={`Offers (${request.offers.length})`}>
        {offers.length ? (
          <ul className="flex flex-col gap-3">
            {offers.map((offer) => (
              <OfferRow key={offer.id} offer={offer} onWithdraw={() => setWithdrawing(offer)} />
            ))}
          </ul>
        ) : (
          <Text>No offers yet.</Text>
        )}
      </DetailSection>

      <div className="flex flex-col gap-3 pt-5">
        {request.booking_id && (
          <p className="text-xs text-hw-grey-500">
            This request became booking #{request.booking_id}. Follow it and settle any problems on{" "}
            <Link href={ROUTES.bookings} className="font-medium text-hw-primary underline-offset-4 hover:underline">Bookings</Link>.
          </p>
        )}
        {closable && (
          <Button variant="destructive" className="w-full" onClick={() => setClosing(true)}>
            <Ban data-icon="inline-start" />
            Close this request
          </Button>
        )}
      </div>

      <ReasonDialog
        open={closing}
        onOpenChange={setClosing}
        title={`Close ${request.reference}?`}
        description={`It stops taking offers${offers.some(({ status }) => status === "SUBMITTED") ? " and the waiting offers are turned down" : ""}. ${request.customer.name} and those providers are told, with your reason. This can't be undone.`}
        quickReasons={QUICK_REASONS}
        placeholder="Why it's being removed. The customer sees this."
        submitLabel="Close request"
        pending={close.isPending}
        onSubmit={(reason, done) => close.mutate({ id: request.id, reason }, { onSuccess: done })}
      />
      <ReasonDialog
        open={withdrawing !== null}
        onOpenChange={(open) => !open && setWithdrawing(null)}
        title={`Withdraw ${withdrawing?.provider.name ?? "this provider"}'s offer?`}
        description="The customer can no longer accept it. The provider is told why, and the customer that an offer was removed."
        quickReasons={QUICK_REASONS}
        placeholder="Why it's being removed. The provider sees this."
        submitLabel="Withdraw offer"
        pending={withdraw.isPending}
        onSubmit={(reason, done) => withdrawing && withdraw.mutate({ id: withdrawing.id, reason }, { onSuccess: done })}
      />
    </div>
  )
}

interface RequestSheetProps {
  requestId: number | null
  onOpenChange: (open: boolean) => void
}

/** One request in full, with its offers, for staff moderating it */
const RequestSheet = ({ requestId, onOpenChange }: RequestSheetProps) => {
  const { data, isPending, isError, refetch } = useAdminRequest(requestId)

  return (
    <DetailSheet open={requestId !== null} onOpenChange={onOpenChange} title="Request">
      {requestId !== null &&
        (isPending ? (
          <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        ) : isError || !data ? (
          <div className="flex flex-col items-start gap-3">
            <Text>We couldn&apos;t load this request.</Text>
            <Button variant="outline" size="sm" onClick={() => refetch()}>Try again</Button>
          </div>
        ) : (
          <RequestDetails request={data} />
        ))}
    </DetailSheet>
  )
}

export default RequestSheet
