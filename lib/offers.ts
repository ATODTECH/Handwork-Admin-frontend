import { formatNairaAmount, formatSchedule } from "@/lib/format"
import type { SemanticTone } from "@/lib/tones"
import type { CustomerOffer, OfferProvider, OfferStatus, OfferTerms } from "@/types/account/requests"

/** Shown wherever a provider left something out, so a gap reads as a gap and not as "none" */
export const NOT_STATED = "Not stated"

export const OFFER_STATUS: Record<OfferStatus, { label: string, tone: SemanticTone }> = {
  SUBMITTED: { label: "Open", tone: "info" },
  ACCEPTED: { label: "Accepted", tone: "success" },
  REJECTED: { label: "Turned down", tone: "neutral" },
  WITHDRAWN: { label: "Withdrawn", tone: "neutral" },
  EXPIRED: { label: "Expired", tone: "warning" },
}

export const completionLabel = (days: number) => (days === 1 ? "1 day" : `${days} days`)

export const priceLabel = (terms: Pick<OfferTerms, "price" | "is_estimate">) =>
  `${formatNairaAmount(terms.price)}${terms.is_estimate ? " (estimate)" : ""}`

export const includedLabel = (included: boolean) => (included ? "Included" : "Not included")

export const validUntilLabel = (validUntil: string | null) => (validUntil ? formatSchedule(validUntil) : "No end date")

export const ratingLabel = ({ average_rating, review_count }: OfferProvider) =>
  average_rating === null ? "No reviews yet" : `${average_rating.toFixed(1)} · ${review_count} ${review_count === 1 ? "review" : "reviews"}`

/** What changed from one set of terms to the next, for the revision history */
export const changedTerms = (before: OfferTerms, after: OfferTerms) => {
  const changes: string[] = []
  if (before.price !== after.price) changes.push(`Price ${formatNairaAmount(before.price)} → ${formatNairaAmount(after.price)}`)
  if (before.completion_days !== after.completion_days) {
    changes.push(`Time ${completionLabel(before.completion_days)} → ${completionLabel(after.completion_days)}`)
  }
  if (before.materials_included !== after.materials_included) changes.push(`Materials ${after.materials_included ? "now included" : "no longer included"}`)
  if (before.labour_included !== after.labour_included) changes.push(`Labour ${after.labour_included ? "now included" : "no longer included"}`)
  if (before.is_estimate !== after.is_estimate) changes.push(after.is_estimate ? "Now an estimate" : "Now a final price")
  if (before.warranty !== after.warranty) changes.push("Warranty changed")
  if (before.additional_charges !== after.additional_charges) changes.push("Extra charges changed")
  if (before.description !== after.description || before.assumptions !== after.assumptions) changes.push("Details changed")
  if (before.valid_until !== after.valid_until) changes.push("Validity changed")
  return changes
}

export type OfferSort = "newest" | "price" | "fastest" | "rating"

export const OFFER_SORTS: { value: OfferSort, label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price", label: "Lowest price" },
  { value: "fastest", label: "Fastest" },
  { value: "rating", label: "Best rated" },
]

/** Sorting only orders the list: nothing is labelled "best", the customer weighs it up */
export const sortOffers = (offers: CustomerOffer[], sort: OfferSort) =>
  [...offers].sort((a, b) => {
    if (sort === "price") return Number(a.price) - Number(b.price)
    if (sort === "fastest") return a.completion_days - b.completion_days
    if (sort === "rating") return (b.provider.average_rating ?? -1) - (a.provider.average_rating ?? -1)
    return b.updated_at.localeCompare(a.updated_at)
  })

/** Offers the customer can still accept */
export const isOpenOffer = ({ status }: CustomerOffer) => status === "SUBMITTED"
