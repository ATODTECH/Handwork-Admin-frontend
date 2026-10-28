import * as Yup from "yup"
import { nairaAmount } from "./validation-artisan"

/** Today as YYYY-MM-DD in the user's own time zone (what a date input expects) */
export const todayIso = () => {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export const bookingSchema = Yup.object({
  serviceIds: Yup.array(Yup.number().required()).min(1, "Pick at least one service").required(),
  description: Yup.string()
    .trim()
    .required("Describe the job")
    .min(15, "Add a little more detail so the artisan can quote properly")
    .max(1000, "Keep it under 1,000 characters"),
  budget: nairaAmount("Budget"),
  address: Yup.string()
    .trim()
    .required("Address is required")
    .min(5, "Enter the address where the job is")
    .max(250, "Keep it under 250 characters"),
  date: Yup.string()
    .required("Choose a date")
    .test("not-past", "Choose today or a later date", (value) => !value || value >= todayIso()),
  time: Yup.string().required("Choose a time"),
})

export type BookingFormValues = Omit<Yup.InferType<typeof bookingSchema>, "budget"> & { budget: string }
