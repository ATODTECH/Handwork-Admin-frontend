"use client"

import { useState } from "react"
import { BadgeCheck, Briefcase, ChevronDown, CircleAlert, History, MapPin, MessageSquareText, Star } from "lucide-react"
import { cn } from "cn"
import { UseAvatar } from "@/components/shared/use-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import { formatLocation } from "@/lib/locations"
import {
  changedTerms,
  completionLabel,
  includedLabel,
  isOpenOffer,
  NOT_STATED,
  OFFER_STATUS,
  ratingLabel,
  validUntilLabel,
} from "@/lib/offers"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { CustomerOffer, OfferStatus } from "@/types/account/requests"

export const OfferStatusBadge = ({ status }: { status: OfferStatus }) => {
  const { label, tone } = OFFER_STATUS[status]
  const { chip, dot } = SEMANTIC_TONES[tone]
  return (
    <Badge className={cn("h-6 gap-1.5 px-2.5", chip)}>
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </Badge>
  )
}

const Term = ({ label, value, missing }: { label: string, value: string, missing?: boolean }) => (
  <div className="flex flex-col gap-0.5 rounded-lg bg-muted/60 px-3 py-2">
    <dt className="text-xs text-hw-grey-500">{label}</dt>
    <dd className={cn("text-sm", missing ? "text-hw-grey-500 italic" : "text-hw-grey-900")}>{value}</dd>
  </div>
)

/** Earlier versions of the offer, newest change first */
const RevisionHistory = ({ offer }: { offer: CustomerOffer }) => {
  const [open, setOpen] = useState(false)
  // A revision keeps the terms from before it, saved when the change was made; the newest "after" is the offer now
  const versions = [...offer.revisions.map(({ terms }) => terms), offer]
  const changes = offer.revisions
    .map(({ created_at }, index) => ({ at: created_at, list: changedTerms(versions[index], versions[index + 1]) }))
    .filter(({ list }) => list.length)
    .reverse()
  if (!changes.length) return null

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-fit items-center gap-1.5 rounded-md text-xs font-medium text-hw-secondary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <History className="size-3.5" />
        Revised {changes.length === 1 ? "once" : `${changes.length} times`}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ol className="flex flex-col gap-2 border-l-2 border-hw-grey-200 pl-3">
          {changes.map(({ at, list }) => (
            <li key={at} className="flex flex-col gap-0.5">
              <span className="text-[11px] text-hw-grey-500">{formatActivityDate(at)}</span>
              {list.map((change) => (
                <span key={change} className="text-xs text-hw-grey-700">{change}</span>
              ))}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

interface OfferCardProps {
  offer: CustomerOffer
  /** The request can still take an acceptance (open and not expired) */
  canAccept: boolean
  /** The chat can still be written in */
  canMessage: boolean
  onAccept: () => void
  onReject: () => void
  onMessage: () => void
}

/** One provider's offer: who they are, the price and terms, and what the customer can do with it */
const OfferCard = ({ offer, canAccept, canMessage, onAccept, onReject, onMessage }: OfferCardProps) => {
  const { provider } = offer
  const open = isOpenOffer(offer)
  const where = formatLocation(provider)

  return (
    <Card className={cn("gap-5 rounded-2xl p-5 shadow-none ring-hw-border", !open && offer.status !== "ACCEPTED" && "opacity-75")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <UseAvatar src={provider.profile_image ?? ""} name={provider.name} aspectRatio="size-12" className="text-base" />
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-semibold text-hw-grey-900">{provider.name}</span>
              {provider.verified && (
                <Badge className="bg-[#E7F6EC] text-hw-text-green-solid">
                  <BadgeCheck />
                  Verified ID
                </Badge>
              )}
              {!open && <OfferStatusBadge status={offer.status} />}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-hw-grey-500">
              <span className="flex items-center gap-1">
                <Star className={cn("size-3.5", provider.average_rating !== null && "fill-[#F3A218] text-[#F3A218]")} />
                {ratingLabel(provider)}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="size-3.5" />
                {provider.completed_jobs} {provider.completed_jobs === 1 ? "job" : "jobs"} done
              </span>
              {where && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {where}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-semibold tracking-tight text-hw-grey-900 tabular-nums">{formatNairaAmount(offer.price)}</span>
          {offer.is_estimate ? (
            <span className="text-xs font-medium text-hw-text-warning">Estimate: final price after seeing the job</span>
          ) : (
            <span className="text-xs text-hw-grey-500">Final price</span>
          )}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Term label="Ready in" value={completionLabel(offer.completion_days)} />
        <Term label="Materials" value={includedLabel(offer.materials_included)} />
        <Term label="Labour" value={includedLabel(offer.labour_included)} />
        <Term label="Warranty" value={offer.warranty || NOT_STATED} missing={!offer.warranty} />
        <Term label="Extra charges" value={offer.additional_charges || "None stated"} missing={!offer.additional_charges} />
        <Term label="Valid until" value={validUntilLabel(offer.valid_until)} />
      </dl>

      <div className="flex flex-col gap-2">
        <p className="text-sm leading-relaxed whitespace-pre-line text-hw-grey-700">{offer.description}</p>
        {offer.assumptions && (
          <p className="flex items-start gap-2 rounded-lg bg-[#FFF8EB] px-3 py-2 text-xs text-hw-grey-700">
            <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-hw-text-warning" />
            <span><span className="font-medium">Assumes:</span> {offer.assumptions}</span>
          </p>
        )}
      </div>

      {provider.work_photos.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs text-hw-grey-500">Past work</span>
          <div className="flex gap-2">
            {provider.work_photos.map((url, index) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="block size-16 overflow-hidden rounded-lg border border-hw-border">
                {/* eslint-disable-next-line @next/next/no-img-element -- public storage URL */}
                <img src={url} alt={`Work by ${provider.name}, photo ${index + 1}`} className="size-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}

      <RevisionHistory offer={offer} />

      {offer.rejection_note && !open && <p className="text-xs text-hw-grey-500">Note: {offer.rejection_note}</p>}

      {(open || canMessage) && (
        <div className="flex flex-wrap gap-2 border-t border-hw-border pt-4">
          {open && canAccept && <Button onClick={onAccept}>Accept offer</Button>}
          {canMessage && (
            <Button variant="outline" onClick={onMessage}>
              <MessageSquareText data-icon="inline-start" />
              Message
            </Button>
          )}
          {open && (
            <Button variant="ghost" onClick={onReject}>
              Turn down
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}

export default OfferCard
