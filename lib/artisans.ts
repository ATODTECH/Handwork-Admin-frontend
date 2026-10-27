import type { SemanticTone } from "@/lib/tones"
import type { IdDocumentType, WorkAvailability } from "@/types/account/artisan"
import type { VerificationStatus } from "@/types/admin/artisans"

export const ID_DOCUMENT_LABELS: Record<IdDocumentType, string> = {
  NIN: "NIN slip or card",
  DL: "Driver's licence",
  PSP: "International passport",
}

export const VERIFICATION_STATUS: Record<VerificationStatus, { label: string, tone: SemanticTone }> = {
  PENDING: { label: "Awaiting review", tone: "warning" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Changes requested", tone: "danger" },
}

const AVAILABILITY_LABELS: Record<WorkAvailability, string> = {
  weekdays_and_weekends: "Any day",
  weekdays_only: "Weekdays only",
  weekends_only: "Weekends only",
}

/** The skill stores availability as three flags; one is true */
export const availabilityLabel = (flags: Record<WorkAvailability, boolean>) =>
  (Object.keys(AVAILABILITY_LABELS) as WorkAvailability[])
    .filter((key) => flags[key])
    .map((key) => AVAILABILITY_LABELS[key])[0] ?? "Not set"
