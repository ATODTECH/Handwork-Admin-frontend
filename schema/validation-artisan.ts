import * as Yup from "yup"
import type { IdDocumentType, PayoutMethod, WorkAvailability } from "@/types/account/artisan"

/** The API stores uploads as Django ImageFields, so only raster images */
export const IMAGE_UPLOAD = {
  accept: ["image/jpeg", "image/png", "image/webp"],
  maxBytes: 5 * 1024 * 1024,
  label: "JPG, PNG or WEBP, up to 5MB",
} as const

export const MAX_WORK_PHOTOS = 3

/** A naira amount typed as text: digits, optionally with thousands separators */
const nairaAmount = (label: string) =>
  Yup.number()
    .transform((_, original) => (original === "" ? undefined : Number(String(original).replace(/,/g, ""))))
    .typeError(`${label} must be a number`)
    .required(`${label} is required`)
    .min(500, `${label} must be at least ₦500`)
    .max(100_000_000, `${label} is too high`)

const imageFile = Yup.mixed<File>()
  .test("type", "Upload a JPG, PNG or WEBP image", (file) => !file || (IMAGE_UPLOAD.accept as readonly string[]).includes(file.type))
  .test("size", "Each image must be 5MB or smaller", (file) => !file || file.size <= IMAGE_UPLOAD.maxBytes)

export const identitySchema = Yup.object({
  nin: Yup.string()
    .trim()
    .required("NIN is required")
    .matches(/^\d{11}$/, "NIN must be exactly 11 digits"),
  documentType: Yup.mixed<IdDocumentType>().oneOf(["DL", "PSP", "NIN"]).required("Choose a document type"),
  document: imageFile.required("Upload a photo of your ID"),
})

export const servicesSchema = Yup.object({
  serviceIds: Yup.array(Yup.number().required()).min(1, "Pick at least one service").required(),
  description: Yup.string()
    .trim()
    .required("Tell customers about your experience")
    .min(30, "Write at least 30 characters so customers know what to expect")
    .max(1000, "Keep it under 1,000 characters"),
  baseCharge: nairaAmount("Lowest charge"),
  capCharge: nairaAmount("Highest charge").min(Yup.ref("baseCharge"), "Highest charge can't be below your lowest charge"),
  availability: Yup.mixed<WorkAvailability>()
    .oneOf(["weekdays_only", "weekends_only", "weekdays_and_weekends"])
    .required("Choose when you work"),
  photos: Yup.array(imageFile.required()).max(MAX_WORK_PHOTOS, `Add up to ${MAX_WORK_PHOTOS} photos`).required(),
})

export const payoutSchema = Yup.object({
  bankName: Yup.string().required("Choose your bank"),
  accountNumber: Yup.string()
    .trim()
    .required("Account number is required")
    .matches(/^\d{10}$/, "Account number must be exactly 10 digits"),
  accountName: Yup.string()
    .trim()
    .required("Account name is required")
    .min(3, "Enter the name on the account")
    .max(350, "Account name is too long"),
  payoutMethod: Yup.mixed<PayoutMethod>().oneOf(["payment_on_delivery", "escrow_payment"]).required(),
})

export type IdentityFormValues = Omit<Yup.InferType<typeof identitySchema>, "document"> & { document: File | null }
export type ServicesFormValues = Omit<Yup.InferType<typeof servicesSchema>, "baseCharge" | "capCharge"> & {
  baseCharge: string
  capCharge: string
}
export type PayoutFormValues = Yup.InferType<typeof payoutSchema>
