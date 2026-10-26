import type { AccountRole } from "@/lib/auth/session"

export interface COUNTRIESType {
  code: string
  name: string
  dial: string
  flag: string
  pattern: RegExp
}

/** Body for `POST /api/user` (customers) and `POST /api/artisan` (artisans) */
export type RegisterType = {
  first_name: string
  last_name: string
  email: string
  password: string
  /** International format, e.g. +2348012345678 */
  contact: string
  role: AccountRole
}

export type FieldName = "firstName" | "lastName" | "phone" | "email" | "password" | "countryCode" | "agreeToTerms"

export interface FieldConfig {
  name: FieldName
  label?: string
  placeholder?: string
  autoComplete?: string
  type?: "text" | "email" | "tel" | "password" | "checkbox"
}
