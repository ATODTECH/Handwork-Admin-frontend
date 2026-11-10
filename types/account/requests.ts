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
