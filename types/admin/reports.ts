import type { BookingStatus } from "@/types/account/dashboard"
import type { ReportReason, ReportStatus, ReportTargetType } from "@/types/account/reports"

/** `?status=` on `GET /api/admin/reports` */
export type ReportFilter = "open" | "actioned" | "dismissed"

export interface ReportCounts extends Record<ReportFilter | "all", number> {
  /** Open reports per target type; types with none are missing */
  open_by_type: Partial<Record<ReportTargetType, number>>
}

export interface ReportPerson {
  id: string
  name: string
  email: string
  role: "USER" | "ARTISAN" | string
  is_active: boolean
}

export interface ReportedPerson extends ReportPerson {
  /** Every report about this person, and how many staff acted on */
  reports_received: number
  reports_actioned: number
}

/** What was reported, as it is now; null for accounts, or when it was deleted */
export type ReportTargetDetails =
  | { kind: "REQUEST", id: number, reference: string, title: string, description: string, stage: string }
  | { kind: "OFFER", id: number, request_id: number, request_title: string, price: string, description: string, status: string }
  | { kind: "MESSAGE", id: number, text: string, hidden: boolean, timestamp: string, booking_id: number | null, request_id: number | null }
  | { kind: "BOOKING", id: number, status: BookingStatus, agreed_amount: string | null, services: string[] }
  | { kind: "REVIEW", id: number, star: number, message: string, hidden: boolean, booking_id: number | null }

/** From `GET /api/admin/reports` (staff only). The API's `target` has no `kind`; `withKind` adds it from `target_type` */
export interface ReportForStaff {
  id: number
  target_type: ReportTargetType
  reason: ReportReason
  reason_label: string
  details: string
  status: ReportStatus
  created_at: string
  reporter: ReportPerson
  reported_user: ReportedPerson | null
  target: ReportTargetDetails | null
  content_hidden: boolean
  resolution_note: string
  resolved_by: string | null
  resolved_at: string | null
  /** Other open reports about the same thing; settling this one settles them too */
  other_open_reports: number
}

export interface ResolveReport {
  id: number
  outcome: "dismiss" | "action"
  note: string
  /** With "action": remove the message or review, withdraw the offer, or close the request */
  hide: boolean
}
