/** Staff review of an artisan (`User.verification_status`) */
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED"

/** ID types the API accepts (`User.DOCUMENT_TYPE`) */
export type IdDocumentType = "DL" | "PSP" | "NIN"

/** One of these is true on a skill; the form picks exactly one */
export type WorkAvailability = "weekdays_only" | "weekends_only" | "weekdays_and_weekends"

/** An artisan's skill, as nested in `GET /api/artisan/{id}` (decimal fields arrive as strings) */
export interface ArtisanSkill {
  id: number
  description: string
  base_charge: string
  cap_charge: string
  weekdays_only: boolean
  weekends_only: boolean
  weekdays_and_weekends: boolean
  image1: string | null
  image2: string | null
  image3: string | null
}

/** From `GET /api/artisan/{id}`: only the fields onboarding reads */
export interface ArtisanProfile {
  id: string
  first_name: string
  last_name: string
  nin: string | null
  document: string | null
  document_type: IdDocumentType | null
  /** Set by the API once bank details are saved */
  onboardingComplete: boolean
  /** Staff review: customers only see APPROVED artisans */
  verification_status: VerificationStatus
  /** Why changes were requested (when REJECTED) */
  verification_note: string
  skill: ArtisanSkill | null
}

/** A bookable service from `GET /api/get_services` */
export interface ServiceOption {
  id: number
  name: string
}

/** A Nigerian bank, from our `/api/banks` route (Paystack's public list) */
export interface Bank {
  name: string
  code: string
}

export interface IdentityPayload {
  nin: string
  documentType: IdDocumentType
  document: File
}

export interface SkillPayload {
  description: string
  baseCharge: number
  capCharge: number
  serviceIds: number[]
  availability: WorkAvailability
  photos: File[]
}

export interface BankDetailsPayload {
  bankName: string
  accountNumber: string
  accountName: string
}
