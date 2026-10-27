import type { IdDocumentType, VerificationStatus } from "@/types/account/artisan"

export type { VerificationStatus }

/** `?status=` on `GET /api/admin/artisans`; "incomplete" = hasn't finished onboarding */
export type ArtisanReviewFilter = "pending" | "approved" | "rejected" | "incomplete"

export type ArtisanReviewCounts = Record<ArtisanReviewFilter, number>

/** The artisan's skill as the API nests it (`SkillSerializer`) */
export interface ReviewSkill {
  description: string
  base_charge: string
  cap_charge: string
  weekdays_only: boolean
  weekends_only: boolean
  weekdays_and_weekends: boolean
  services: { id: number, name: string }[]
  images: { url: string }[]
}

/** From `GET /api/admin/artisans` (staff only) */
export interface ArtisanForReview {
  id: string
  first_name: string
  last_name: string
  email: string
  contact: string
  profile_image: string | null
  address: string | null
  city: string | null
  state: string | null
  nin: string | null
  /** Signed URL, valid for a few minutes */
  document: string | null
  document_type: IdDocumentType | null
  onboardingComplete: boolean
  verification_status: VerificationStatus
  verification_note: string
  verified_at: string | null
  verified_by: string | null
  date_joined: string
  skill: ReviewSkill | null
  bank_details: { name: string, account_number: string, account_name: string } | null
}
