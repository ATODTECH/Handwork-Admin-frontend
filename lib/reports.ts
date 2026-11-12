import type { SemanticTone } from "@/lib/tones"
import type { ReportReason, ReportStatus, ReportTargetType } from "@/types/account/reports"

export const MAX_REPORT_DETAILS = 2000
/** "Something else" needs this much explanation (`CreateReportSerializer`) */
export const MIN_OTHER_DETAILS = 10

/** In the order people are asked, with the labels the API uses */
export const REPORT_REASONS: { value: ReportReason, label: string, description: string }[] = [
  { value: "SCAM", label: "Scam or fraud", description: "Trying to take money or personal details dishonestly" },
  { value: "OFF_PLATFORM", label: "Asked to pay outside Handwork Expert", description: "Bank transfer, cash or another app instead of paying here" },
  { value: "FAKE", label: "Fake or misleading", description: "False claims, someone else's photos, or a made-up review" },
  { value: "HARASSMENT", label: "Harassment or abuse", description: "Threats, insults or unwanted contact" },
  { value: "INAPPROPRIATE", label: "Inappropriate content", description: "Offensive words or pictures" },
  { value: "SAFETY", label: "Safety concern", description: "Something that could put someone in danger" },
  { value: "SPAM", label: "Spam", description: "Repeated, unrelated or advertising messages" },
  { value: "OTHER", label: "Something else", description: "Tell us what happened" },
]

export const TARGET_NOUNS: Record<ReportTargetType, string> = {
  USER: "account",
  REQUEST: "request",
  OFFER: "offer",
  MESSAGE: "message",
  BOOKING: "booking",
  REVIEW: "review",
}

export const REPORT_STATUS: Record<ReportStatus, { label: string, tone: SemanticTone }> = {
  OPEN: { label: "Open", tone: "warning" },
  ACTIONED: { label: "Action taken", tone: "success" },
  DISMISSED: { label: "Dismissed", tone: "neutral" },
}
