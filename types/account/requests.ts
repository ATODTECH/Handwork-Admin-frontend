/** How the job gets done: at the customer's place, made elsewhere and delivered, or remotely */
export type Fulfilment = "ON_SITE" | "DELIVERY" | "REMOTE"

export type Urgency = "FLEXIBLE" | "SOON" | "URGENT"

export type RequestVisibility = "PUBLIC" | "PRIVATE"

/** What's stored on the API */
export type RequestStatus = "DRAFT" | "OPEN" | "ACCEPTED" | "CLOSED"

/** Worked out by the API: from the offers while open, then from the booking once an offer is accepted */
export type RequestStage =
  | "DRAFT"
  | "PUBLISHED"
  | "RECEIVING_OFFERS"
  | "EXPIRED"
  | "CLOSED"
  | "OFFER_ACCEPTED"
  | "AWAITING_PAYMENT"
  | "IN_PROGRESS"
  | "AWAITING_APPROVAL"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED"
  | "REFUNDED"

/** A photo or video on a request. `url` is a signed link that expires after about 15 minutes. */
export interface RequestAttachment {
  id: number
  kind: "IMAGE" | "VIDEO"
  url: string | null
  content_type: string
  size: number
  /** Only the provider whose offer is accepted sees it */
  private: boolean
  created_at: string
}

/** Category-specific details, e.g. { Quantity: "2", Material: "Ankara" } */
export type RequestDetails = Record<string, string>

/** The customer's own request, from `/api/requests` (decimal fields arrive as strings) */
export interface JobRequest {
  id: number
  /** e.g. REQ-000042 */
  reference: string
  title: string
  category: number | null
  services: number[]
  description: string
  details: RequestDetails
  fulfilment: Fulfilment
  state: string
  city: string
  address: string
  budget_min: string | null
  budget_max: string | null
  budget_flexible: boolean
  /** YYYY-MM-DD */
  deadline: string | null
  urgency: Urgency
  visibility: RequestVisibility
  target_provider: string | null
  status: RequestStatus
  stage: RequestStage
  /** Offers the customer can still accept, plus the accepted one */
  offer_count: number
  attachments: RequestAttachment[]
  published_at: string | null
  expires_at: string | null
  closed_at: string | null
  close_reason: string
  accepted_offer: number | null
  booking_id: number | null
  created_at: string
  updated_at: string
}

/** What the request form sends when creating or editing */
export interface RequestPayload {
  title: string
  category: number | null
  services: number[]
  description: string
  details: RequestDetails
  fulfilment: Fulfilment
  state: string
  city: string
  address: string
  budget_min: string | null
  budget_max: string | null
  budget_flexible: boolean
  deadline: string | null
  urgency: Urgency
  visibility?: RequestVisibility
  target_provider?: string | null
}

/** What an offer can be. "EXPIRED" is worked out from `valid_until`. */
export type OfferStatus = "SUBMITTED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN" | "EXPIRED"

/** The terms a provider can revise; each revision keeps a copy of the earlier ones */
export interface OfferTerms {
  price: string
  description: string
  completion_days: number
  materials_included: boolean
  labour_included: boolean
  additional_charges: string
  warranty: string
  assumptions: string
  /** A preliminary price: the final one depends on seeing the job */
  is_estimate: boolean
  /** YYYY-MM-DD */
  valid_until: string | null
}

/** What a customer sees about a provider when comparing offers: no contact details */
export interface OfferProvider {
  id: string
  name: string
  profile_image: string | null
  state: string | null
  city: string | null
  verified: boolean
  /** From reviews tied to paid jobs only */
  average_rating: number | null
  review_count: number
  completed_jobs: number
  /** YYYY-MM-DD */
  member_since: string
  services: string[]
  work_photos: string[]
  charges: { lowest: string, highest: string } | null
}

/** An offer on the customer's request, from `GET /api/requests/{id}/offers` */
export interface CustomerOffer extends OfferTerms {
  id: number
  request: number
  currency: string
  status: OfferStatus
  viewed_at: string | null
  rejection_note: string
  revision_count: number
  booking_id: number | null
  created_at: string
  updated_at: string
  provider: OfferProvider
  /** Earlier terms, oldest first */
  revisions: { terms: OfferTerms, created_at: string }[]
}

/** The final agreement when accepting: when the job happens and where */
export interface AcceptOfferPayload {
  offerId: number
  /** YYYY-MM-DD */
  date: string
  /** HH:MM */
  time: string
  address: string
}

/** A message in a request chat (same shape as a booking chat's) */
export interface RequestMessage {
  id: number
  sender: string
  sender_name: string
  sender_role: string
  text: string
  /** Removed by staff after a report */
  hidden: boolean
  timestamp: string
  is_read: boolean
}

export interface RequestThread {
  messages: RequestMessage[]
  /** False once the request stops taking offers */
  can_send: boolean
}

/** A provider's own offer (`/api/offers`, and `my_offer` on a request) */
export interface ProviderOffer extends OfferTerms {
  id: number
  request: number
  currency: string
  status: OfferStatus
  /** When the customer first looked at it (or at the latest revision) */
  viewed_at: string | null
  rejection_note: string
  revision_count: number
  booking_id: number | null
  created_at: string
  updated_at: string
  /** Only in the `/api/offers` list */
  request_summary?: {
    id: number
    reference: string
    title: string
    stage: RequestStage
    customer: string
    state: string
    city: string
    deadline: string | null
  }
}

/** A request as a provider sees it: no address or private files until their offer is accepted */
export interface ProviderRequest {
  id: number
  reference: string
  title: string
  category: { id: number, name: string } | null
  services: { id: number, name: string }[]
  description: string
  details: RequestDetails
  fulfilment: Fulfilment
  state: string
  city: string
  /** Only once their offer is accepted */
  address: string | null
  budget_min: string | null
  budget_max: string | null
  budget_flexible: boolean
  deadline: string | null
  urgency: Urgency
  /** Sent to this provider only */
  private: boolean
  customer: { first_name: string, member_since: string }
  attachments: RequestAttachment[]
  stage: RequestStage
  offer_count: number
  my_offer: ProviderOffer | null
  saved: boolean
  published_at: string | null
  expires_at: string | null
}

export interface RequestFeedFilters {
  /** Every open request, not only those for services the provider offers */
  all?: boolean
  saved?: boolean
  category?: number
  state?: string
  search?: string
}

export type OfferPayload = Omit<OfferTerms, "price"> & { price: string }
