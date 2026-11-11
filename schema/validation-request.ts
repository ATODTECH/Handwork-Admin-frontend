import * as Yup from "yup"
import { NIGERIAN_STATES } from "@/lib/locations"
import type { Fulfilment, Urgency } from "@/types/account/requests"
import { todayIso } from "./validation-booking"

/** An optional naira amount typed as text */
const optionalAmount = (label: string) =>
  Yup.string()
    .trim()
    .test("number", `${label} must be a number`, (value) => !value || /^\d[\d,]*$/.test(value))
    .test("max", `${label} is too high`, (value) => !value || Number(value.replace(/,/g, "")) <= 100_000_000)

const needsLocation = (fulfilment: Fulfilment) => fulfilment !== "REMOTE"

// Lengths follow the API: title 5–120, description 20–5,000, address 400
export const requestSchema = Yup.object({
  categoryId: Yup.number().nullable().required("Choose a category"),
  serviceIds: Yup.array(Yup.number().required()).min(1, "Pick at least one service").required(),
  title: Yup.string()
    .trim()
    .required("Give your request a title")
    .min(5, "Make the title a little longer")
    .max(120, "Keep the title under 120 characters"),
  description: Yup.string()
    .trim()
    .required("Describe what you need")
    .min(20, "Add a little more detail so artisans can quote properly")
    .max(5000, "Keep it under 5,000 characters"),
  details: Yup.object().default({}),
  fulfilment: Yup.mixed<Fulfilment>().oneOf(["ON_SITE", "DELIVERY", "REMOTE"]).required(),
  state: Yup.string().when("fulfilment", {
    is: needsLocation,
    then: (schema) => schema.oneOf<string>([...NIGERIAN_STATES], "Choose the state").required("Choose the state"),
    otherwise: (schema) => schema.optional(),
  }),
  city: Yup.string()
    .trim()
    .max(60, "Keep it under 60 characters")
    .when("fulfilment", {
      is: needsLocation,
      then: (schema) => schema.required("Enter the city or area"),
      otherwise: (schema) => schema.optional(),
    }),
  address: Yup.string()
    .trim()
    .max(400, "Keep it under 400 characters")
    .when("fulfilment", {
      is: (fulfilment: Fulfilment) => fulfilment === "ON_SITE",
      then: (schema) => schema.required("Enter the address").min(5, "Enter the full address"),
      otherwise: (schema) => schema.optional(),
    }),
  budgetMin: optionalAmount("Lowest budget"),
  budgetMax: optionalAmount("Highest budget").test(
    "not-below-min",
    "The highest budget can't be below the lowest",
    (value, { parent }) => {
      const min = Number(String(parent.budgetMin ?? "").replace(/,/g, ""))
      const max = Number(String(value ?? "").replace(/,/g, ""))
      return !value || !parent.budgetMin || max >= min
    },
  ),
  budgetFlexible: Yup.boolean().default(false),
  deadline: Yup.string().test("not-past", "Choose today or a later date", (value) => !value || value >= todayIso()),
  urgency: Yup.mixed<Urgency>().oneOf(["FLEXIBLE", "SOON", "URGENT"]).required(),
})

export interface RequestFormValues {
  categoryId: number | null
  serviceIds: number[]
  title: string
  description: string
  details: Record<string, string>
  fulfilment: Fulfilment
  state: string
  city: string
  address: string
  budgetMin: string
  budgetMax: string
  budgetFlexible: boolean
  deadline: string
  urgency: Urgency
}
