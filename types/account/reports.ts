/** What can be reported (`Report.TARGET_TYPES` on the API) */
export type ReportTargetType = "USER" | "REQUEST" | "OFFER" | "MESSAGE" | "BOOKING" | "REVIEW"

/** Why (`Report.REASONS`); OTHER needs at least 10 characters of details */
export type ReportReason = "SCAM" | "FAKE" | "INAPPROPRIATE" | "HARASSMENT" | "SAFETY" | "OFF_PLATFORM" | "SPAM" | "OTHER"

export type ReportStatus = "OPEN" | "ACTIONED" | "DISMISSED"

export interface ReportTarget {
  type: ReportTargetType
  /** A user's UUID, or the number of anything else */
  id: string | number
}

export interface ReportPayload {
  target: ReportTarget
  reason: ReportReason
  details: string
}

/** From `POST/GET /api/reports`: the reporter sees the outcome, not staff's notes */
export interface MyReport {
  id: number
  target_type: ReportTargetType
  reason: ReportReason
  reason_label: string
  details: string
  status: ReportStatus
  created_at: string
  resolved_at: string | null
}
