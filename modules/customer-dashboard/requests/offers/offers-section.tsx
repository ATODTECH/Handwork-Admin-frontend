"use client"

import { useState } from "react"
import { ArrowDownUp, Inbox } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { FilterTabs } from "@/components/shared/filter-tabs"
import ReasonDialog from "@/components/shared/reason-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRejectOffer, useRequestOffers } from "@/hooks/account/use-requests"
import { isOpenOffer, OFFER_SORTS, sortOffers, type OfferSort } from "@/lib/offers"
import type { CustomerOffer, JobRequest, OfferProvider } from "@/types/account/requests"
import AcceptOfferDialog from "./accept-offer-dialog"
import CompareTable from "./compare-table"
import OfferCard from "./offer-card"
import RequestChatSheet from "./request-chat-sheet"

type View = "cards" | "compare"

const REJECT_REASONS = ["The price is too high", "It would take too long", "I went with another provider"]

/** Every offer on the request: as cards, or side by side, with accepting, turning down and messaging */
const OffersSection = ({ request }: { request: JobRequest }) => {
  const offers = useRequestOffers(request.id)
  const reject = useRejectOffer()
  const [view, setView] = useState<View>("cards")
  const [sort, setSort] = useState<OfferSort>("newest")
  const [accepting, setAccepting] = useState<CustomerOffer | null>(null)
  const [rejecting, setRejecting] = useState<CustomerOffer | null>(null)
  const [chatWith, setChatWith] = useState<OfferProvider | null>(null)

  const all = offers.data ?? []
  const open = sortOffers(all.filter(isOpenOffer), sort)
  const others = all.filter((offer) => !isOpenOffer(offer))
  // Only while the request takes offers: once one is accepted, or it's closed or expired, nothing more can be
  const takingOffers = request.stage === "PUBLISHED" || request.stage === "RECEIVING_OFFERS"

  return (
    <SectionCard
      title={open.length ? `Offers (${open.length})` : "Offers"}
      description={takingOffers && open.length > 1 ? "Weigh up price, timing, what's included and reviews. The cheapest isn't always the best fit." : undefined}
      contentClassName="flex flex-col gap-5"
    >
      {open.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterTabs<View>
            label="How to show the offers"
            tabs={[{ value: "cards", label: "Cards" }, { value: "compare", label: "Compare side by side" }]}
            value={view}
            onChange={setView}
          />
          {view === "cards" && (
            <Select items={OFFER_SORTS} value={sort} onValueChange={(next) => setSort((next as OfferSort | null) ?? "newest")}>
              <SelectTrigger aria-label="Sort offers" className="h-9 w-44">
                <ArrowDownUp className="size-4 text-hw-grey-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {OFFER_SORTS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <QueryContent
        isPending={offers.isPending}
        isError={offers.isError}
        onRetry={offers.refetch}
        isEmpty={!all.length}
        empty={
          <EmptyState
            icon={Inbox}
            title="No offers yet"
            description={
              takingOffers
                ? "Providers who offer this service have been told. You'll get a notification when an offer comes in."
                : "Nobody sent an offer on this request."
            }
          />
        }
      >
        {view === "compare" && open.length > 1 ? (
          <CompareTable offers={open} canAccept={takingOffers} onAccept={setAccepting} />
        ) : (
          <div className="flex flex-col gap-4">
            {open.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                canAccept={takingOffers}
                canMessage={takingOffers}
                onAccept={() => setAccepting(offer)}
                onReject={() => setRejecting(offer)}
                onMessage={() => setChatWith(offer.provider)}
              />
            ))}
          </div>
        )}

        {others.length > 0 && (
          <details className="group flex flex-col gap-3">
            <summary className="cursor-pointer text-sm font-medium text-hw-grey-700 select-none">
              {open.length ? "Other offers" : "Offers"} ({others.length})
            </summary>
            <div className="mt-3 flex flex-col gap-4">
              {others.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  canAccept={false}
                  canMessage={false}
                  onAccept={() => undefined}
                  onReject={() => undefined}
                  onMessage={() => undefined}
                />
              ))}
            </div>
          </details>
        )}
      </QueryContent>

      <AcceptOfferDialog request={request} offer={accepting} onOpenChange={(next) => !next && setAccepting(null)} />
      <ReasonDialog
        open={rejecting !== null}
        onOpenChange={(next) => !next && setRejecting(null)}
        title={rejecting ? `Turn down ${rejecting.provider.name}'s offer?` : "Turn down this offer?"}
        description="We'll let them know. They can't be accepted again unless they send a new offer."
        quickReasons={REJECT_REASONS}
        placeholder="Tell them why (optional): it helps them send better offers."
        submitLabel="Turn down"
        cancelLabel="Keep it"
        minLength={0}
        pending={reject.isPending}
        onSubmit={(reason, done) => rejecting && reject.mutate({ offerId: rejecting.id, reason }, { onSuccess: done })}
      />
      <RequestChatSheet requestId={request.id} requestTitle={request.title} provider={chatWith} onOpenChange={(next) => !next && setChatWith(null)} />
    </SectionCard>
  )
}

export default OffersSection
