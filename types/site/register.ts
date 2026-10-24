export interface COUNTRIESType {
  code: string
  name: string
  dial: string
  flag: string
  pattern: RegExp
}

export type RegisterType = {
  name: string
  email: string
  password: string
  phone: string
}

export type FieldName = "name" | "phone" | "email" | "password" | "countryCode" | "agreeToTerms"

export interface FieldConfig {
  name: FieldName
  label?: string
  autoComplete?: string
  type?: "text" | "email" | "tel" | "password" | "checkbox"
}

