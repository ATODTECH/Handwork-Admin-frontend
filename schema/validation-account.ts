import * as Yup from "yup"
import { NIGERIAN_STATES } from "@/lib/locations"
import { locationSchema } from "./validation-artisan"

const name = (label: string) =>
  Yup.string()
    .trim()
    .required(`${label} is required`)
    .min(2, `${label} must be at least 2 characters`)
    .max(100, `${label} is too long`)

const details = {
  firstName: name("First name"),
  lastName: name("Last name"),
  contact: Yup.string()
    .trim()
    .required("Phone number is required")
    .matches(/^\+?\d{7,14}$/, "Enter a valid phone number, e.g. 08012345678"),
}

/** Customers can leave their location empty; only what they fill in is checked */
export const customerProfileSchema = Yup.object({
  ...details,
  state: Yup.string().oneOf<string>(["", ...NIGERIAN_STATES], "Choose your state"),
  city: Yup.string().trim().max(40, "Keep it under 40 characters"),
  address: Yup.string().trim().max(250, "Keep it under 250 characters"),
})

/** Customers search by an artisan's area, and staff can't approve one without it */
export const artisanProfileSchema = locationSchema.shape(details)

export interface ProfileFormValues {
  firstName: string
  lastName: string
  contact: string
  state: string
  city: string
  address: string
}

/** The API stores numbers in international form; Nigerian numbers are usually typed from 0 */
export const toInternationalContact = (contact: string) => contact.replace(/^0(\d{10})$/, "+234$1")
