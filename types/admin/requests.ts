import type { Fulfilment, OfferStatus, RequestAttachment, RequestDetails, RequestStage, Urgency } from "@/types/account/requests"
import type { ReportPerson } from "./reports"

/** `?status=` on `GET /api/admin/requests` */
export type RequestFilter = "open" | "booked" | "closed" | "draft"

export type RequestCounts = Record<RequestFilter | "all", number>

/** From `GET /api/admin/requests` (staff only); amounts in naira as decimal strings */
export interface RequestForStaff {
  id: number
  reference: string
  title: string
  category: string | null
  services: string[]
  customer: ReportPerson
  fulfilment: Fulfilment
  state: string
  city: string
  budget_min: string | null
  budget_max: string | null
  budget_flexible: boolean
  deadline: string | null
  urgency: Urgency
  visibility: "PUBLIC" | "PRIVATE"
  /** The one provider a private request went to */
  target_provider: ReportPerson | null
  status: "DRAFT" | "OPEN" | "ACCEPTED" | "CLOSED"
  stage: RequestStage
  /** Offers still in play (waiting or accepted) */
  offer_count: number
  open_reports: number
  booking_id: number | null
  published_at: string | null
  expires_at: string | null
  closed_at: string | null
  close_reason: string
  created_at: string
  updated_at: string
}

export interface OfferForStaff {
  id: number
  request: number
  provider: ReportPerson
  price: string
  description: string
  completion_days: number
  materials_included: boolean
  labour_included: boolean
  additional_charges: string
  warranty: string
  assumptions: string
  is_estimate: boolean
  valid_until: string | null
  status: OfferStatus
  viewed_at: string | null
  rejection_note: string
  revision_count: number
  open_reports: number
  created_at: string
  updated_at: string
}

/** From `GET /api/admin/requests/{id}`: the full text, address, files and every offer */
export interface RequestDetailForStaff extends RequestForStaff {
  description: string
  details: RequestDetails
  address: string
  attachments: RequestAttachment[]
  offers: OfferForStaff[]
}

export interface StaffAction {
  id: number
  reason: string
}
