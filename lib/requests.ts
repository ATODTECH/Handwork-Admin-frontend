import type { SemanticTone } from "@/lib/tones"
import type { Fulfilment, JobRequest, RequestStage, Urgency } from "@/types/account/requests"

/** Mirrors the API's limits on `POST /api/requests/{id}/attachments` */
export const REQUEST_MEDIA = {
  image: { accept: ["image/jpeg", "image/png", "image/webp"], maxBytes: 10 * 1024 * 1024, max: 8 },
  video: { accept: ["video/mp4", "video/quicktime", "video/webm"], maxBytes: 50 * 1024 * 1024, max: 2 },
  hint: "Photos (JPG, PNG, WebP) up to 10MB, videos (MP4, MOV, WebM) up to 50MB",
} as const

export const mediaKind = (type: string): "IMAGE" | "VIDEO" | null =>
  (REQUEST_MEDIA.image.accept as readonly string[]).includes(type)
    ? "IMAGE"
    : (REQUEST_MEDIA.video.accept as readonly string[]).includes(type)
      ? "VIDEO"
      : null

export const FULFILMENT_OPTIONS: { value: Fulfilment, label: string, description: string }[] = [
  { value: "ON_SITE", label: "At my place", description: "The provider comes to you." },
  { value: "DELIVERY", label: "Made and delivered", description: "They make it and deliver it to you." },
  { value: "REMOTE", label: "Remotely", description: "No visit needed: online or by phone." },
]

export const URGENCY_OPTIONS: { value: Urgency, label: string }[] = [
  { value: "FLEXIBLE", label: "Flexible" },
  { value: "SOON", label: "Within a few days" },
  { value: "URGENT", label: "Urgent" },
]

export const urgencyLabel = (urgency: Urgency) => URGENCY_OPTIONS.find(({ value }) => value === urgency)?.label ?? urgency

/**
 * Extra details worth asking for in each category (by the names in the API's catalogue), so providers can
 * quote properly. All optional; they're sent as `details`.
 */
export const CATEGORY_DETAILS: Record<string, { key: string, placeholder: string }[]> = {
  "Fashion And Beauty": [
    { key: "Size or measurements", placeholder: "e.g. UK 12, or chest 40in" },
    { key: "Fabric or material", placeholder: "e.g. Ankara, or I'll supply it" },
    { key: "Quantity", placeholder: "e.g. 2" },
  ],
  "Home And Property": [
    { key: "Property type", placeholder: "e.g. 3-bedroom flat" },
    { key: "Size or dimensions", placeholder: "e.g. 2m × 1.5m wall" },
    { key: "Materials", placeholder: "e.g. I have the tiles already" },
  ],
  Automotive: [
    { key: "Make and model", placeholder: "e.g. Toyota Corolla" },
    { key: "Year", placeholder: "e.g. 2012" },
    { key: "What you've noticed", placeholder: "e.g. warning light, noise when braking" },
  ],
  "Logistics And Warehousing": [
    { key: "What's being moved", placeholder: "e.g. 20 cartons of drinks" },
    { key: "Weight or volume", placeholder: "e.g. about 300kg" },
    { key: "From and to", placeholder: "e.g. Ikeja to Lekki" },
  ],
  "Export Services": [
    { key: "Goods", placeholder: "e.g. dried hibiscus" },
    { key: "Quantity or weight", placeholder: "e.g. 2 tonnes" },
    { key: "Destination country", placeholder: "e.g. Germany" },
  ],
  Agriculture: [
    { key: "Farm size", placeholder: "e.g. 2 hectares" },
    { key: "Crop or livestock", placeholder: "e.g. cassava" },
  ],
  "Tech/IT": [
    { key: "Device or system", placeholder: "e.g. HP laptop, office network" },
    { key: "Quantity", placeholder: "e.g. 5 computers" },
  ],
}

interface StageMeta {
  label: string
  tone: SemanticTone
  /** One line on what happens next, for the request page */
  hint: string
}

export const STAGE_META: Record<RequestStage, StageMeta> = {
  DRAFT: { label: "Draft", tone: "neutral", hint: "Only you can see this. Publish it so providers can send offers." },
  PUBLISHED: { label: "Waiting for offers", tone: "info", hint: "Providers who offer this service have been told. Offers will show up here." },
  RECEIVING_OFFERS: { label: "Receiving offers", tone: "brand", hint: "Compare the offers and accept the one that suits you best." },
  EXPIRED: { label: "Expired", tone: "neutral", hint: "This request stopped taking offers. Renew it to keep looking." },
  CLOSED: { label: "Closed", tone: "neutral", hint: "You closed this request." },
  OFFER_ACCEPTED: { label: "Offer accepted", tone: "info", hint: "You accepted an offer." },
  AWAITING_PAYMENT: { label: "Pay to confirm", tone: "warning", hint: "Pay for the offer you accepted to confirm the booking." },
  IN_PROGRESS: { label: "In progress", tone: "info", hint: "The job is booked. Follow it in My bookings." },
  AWAITING_APPROVAL: { label: "Confirm the job", tone: "warning", hint: "The provider says the job is done. Confirm it in My bookings." },
  COMPLETED: { label: "Completed", tone: "success", hint: "The job is done and the provider has been paid." },
  CANCELLED: { label: "Cancelled", tone: "neutral", hint: "The booking was cancelled." },
  DISPUTED: { label: "Problem reported", tone: "danger", hint: "We're holding the payment while our team looks into it." },
  REFUNDED: { label: "Refunded", tone: "neutral", hint: "We refunded your payment." },
}

export type RequestGroup = "all" | "open" | "booked" | "done" | "closed"

const GROUPS: Record<Exclude<RequestGroup, "all">, RequestStage[]> = {
  open: ["DRAFT", "PUBLISHED", "RECEIVING_OFFERS"],
  booked: ["OFFER_ACCEPTED", "AWAITING_PAYMENT", "IN_PROGRESS", "AWAITING_APPROVAL", "DISPUTED"],
  done: ["COMPLETED", "REFUNDED"],
  closed: ["CLOSED", "EXPIRED", "CANCELLED"],
}

export const filterRequests = (requests: JobRequest[], group: RequestGroup) =>
  group === "all" ? requests : requests.filter(({ stage }) => GROUPS[group].includes(stage))

/** The customer can still change it (no offer accepted yet) */
export const isEditable = ({ status }: JobRequest) => status === "DRAFT" || status === "OPEN"

/** "₦10,000 – ₦25,000", "Up to ₦25,000", "Flexible"… */
export const budgetLabel = (
  { budget_min, budget_max, budget_flexible }: Pick<JobRequest, "budget_min" | "budget_max" | "budget_flexible">,
  format: (amount: string) => string,
) => {
  const range =
    budget_min && budget_max
      ? budget_min === budget_max ? format(budget_min) : `${format(budget_min)} – ${format(budget_max)}`
      : budget_max ? `Up to ${format(budget_max)}` : budget_min ? `From ${format(budget_min)}` : null
  if (!range) return "Open to offers"
  return budget_flexible ? `${range} (flexible)` : range
}
