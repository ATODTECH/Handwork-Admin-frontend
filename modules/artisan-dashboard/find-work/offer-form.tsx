"use client"

import { useFormik } from "formik"
import * as Yup from "yup"
import DateField from "@/components/form/date-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import StepForm from "@/components/form/step-form"
import TextareaField from "@/components/form/textarea-field"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { useReviseOffer, useSendOffer } from "@/hooks/account/use-provider-requests"
import { artisanEarnings } from "@/lib/bookings"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { formatNairaAmount } from "@/lib/format"
import { toApiError } from "@/lib/http/errors"
import { todayIso } from "@/schema/validation-booking"
import type { OfferPayload, ProviderOffer } from "@/types/account/requests"

interface OfferFormValues {
  price: string
  completionDays: string
  description: string
  isEstimate: boolean
  materialsIncluded: boolean
  labourIncluded: boolean
  additionalCharges: string
  warranty: string
  assumptions: string
  validUntil: string
}

type TextKey = "price" | "completionDays" | "description" | "additionalCharges" | "warranty" | "assumptions" | "validUntil"

const API_FIELDS: Record<string, TextKey> = {
  price: "price",
  completion_days: "completionDays",
  description: "description",
  additional_charges: "additionalCharges",
  warranty: "warranty",
  assumptions: "assumptions",
  valid_until: "validUntil",
}

// Limits follow the API: price above 0, 1–365 days, description 10–3,000, warranty 300
const offerSchema = Yup.object({
  price: Yup.string()
    .required("Enter your price")
    .test("amount", "Enter a price of at least ₦500", (value) => Number(value) >= 500)
    .test("max", "That price is too high", (value) => Number(value) <= 100_000_000),
  completionDays: Yup.string()
    .required("How many days will it take?")
    .test("days", "Enter between 1 and 365 days", (value) => Number(value) >= 1 && Number(value) <= 365),
  description: Yup.string().trim().required("Say what you'll do").min(10, "Add a little more detail").max(3000, "Keep it under 3,000 characters"),
  additionalCharges: Yup.string().trim().max(1000, "Keep it under 1,000 characters"),
  warranty: Yup.string().trim().max(300, "Keep it under 300 characters"),
  assumptions: Yup.string().trim().max(1000, "Keep it under 1,000 characters"),
  validUntil: Yup.string().test("not-past", "Choose today or a later date", (value) => !value || value >= todayIso()),
})

const fromOffer = (offer: ProviderOffer | null): OfferFormValues => ({
  price: offer ? String(Math.round(Number(offer.price))) : "",
  completionDays: offer ? String(offer.completion_days) : "",
  description: offer?.description ?? "",
  isEstimate: offer?.is_estimate ?? false,
  materialsIncluded: offer?.materials_included ?? false,
  labourIncluded: offer?.labour_included ?? true,
  additionalCharges: offer?.additional_charges ?? "",
  warranty: offer?.warranty ?? "",
  assumptions: offer?.assumptions ?? "",
  // An old validity date would block sending again
  validUntil: offer?.valid_until && offer.valid_until >= todayIso() ? offer.valid_until : "",
})

const toPayload = (values: OfferFormValues): OfferPayload => ({
  price: values.price,
  completion_days: Number(values.completionDays),
  description: values.description.trim(),
  is_estimate: values.isEstimate,
  materials_included: values.materialsIncluded,
  labour_included: values.labourIncluded,
  additional_charges: values.additionalCharges.trim(),
  warranty: values.warranty.trim(),
  assumptions: values.assumptions.trim(),
  valid_until: values.validUntil || null,
})

/** Only what changed, so the customer's revision history shows real changes */
const changedFields = (before: OfferPayload, after: OfferPayload) =>
  Object.fromEntries(
    (Object.keys(after) as (keyof OfferPayload)[])
      .filter((key) => String(before[key] ?? "") !== String(after[key] ?? ""))
      .map((key) => [key, after[key]]),
  ) as Partial<OfferPayload>

const NairaAddon = <span className="text-hw-grey-700">₦</span>

interface CheckProps {
  id: string
  label: string
  description?: string
  checked: boolean
  disabled: boolean
  onChange: (checked: boolean) => void
}

const Check = ({ id, label, description, checked, disabled, onChange }: CheckProps) => (
  <Field orientation="horizontal">
    <Checkbox id={id} checked={checked} disabled={disabled} onCheckedChange={(value) => onChange(value === true)} />
    <FieldContent>
      <FieldLabel htmlFor={id} className="font-normal">{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
    </FieldContent>
  </Field>
)

interface OfferFormProps {
  requestId: number
  /** The provider's current offer. Open: the form revises it. Withdrawn or turned down: it pre-fills a new one. */
  offer: ProviderOffer | null
  onDone?: () => void
}

/** Sending or revising an offer: the price and the terms customers compare */
const OfferForm = ({ requestId, offer, onDone }: OfferFormProps) => {
  const send = useSendOffer()
  const revise = useReviseOffer()
  const revising = offer?.status === "SUBMITTED" || offer?.status === "EXPIRED"
  const error = revising ? revise.error : send.error

  const formik = useFormik<OfferFormValues>({
    initialValues: fromOffer(offer),
    validationSchema: offerSchema,
    onSubmit: async (values, { setErrors }) => {
      const terms = toPayload(values)
      try {
        if (revising && offer) {
          const changes = changedFields(toPayload(fromOffer(offer)), terms)
          if (Object.keys(changes).length) await revise.mutateAsync({ id: offer.id, changes })
        } else {
          await send.mutateAsync({ requestId, terms })
        }
        onDone?.()
      } catch (saveError) {
        setErrors(toFormErrors(toApiError(saveError), API_FIELDS))
      }
    },
  })

  const { values, setFieldValue, isSubmitting } = formik
  const price = Number(values.price)

  return (
    <StepForm
      onSubmit={formik.handleSubmit}
      pending={isSubmitting}
      submitLabel={revising ? "Update offer" : "Send offer"}
      pendingLabel={revising ? "Updating…" : "Sending…"}
      formError={formLevelError(error, API_FIELDS)}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          {...textFieldProps(formik, "price", { digits: true })}
          label="Your price"
          placeholder="20000"
          startAddon={NairaAddon}
          description={price >= 500 ? `You'd receive ${formatNairaAmount(artisanEarnings(price))} after our 10% fee.` : "The total the customer pays."}
        />
        <FormField
          {...textFieldProps(formik, "completionDays", { digits: true })}
          label="Days to finish"
          placeholder="2"
          endAddon={<span className="text-hw-grey-500">days</span>}
        />
      </div>

      <Check
        id="isEstimate"
        label="This is an estimate"
        description="Tick it if you need to see the job before you can give a final price (a car or an AC unit, say)."
        checked={values.isEstimate}
        disabled={isSubmitting}
        onChange={(checked) => setFieldValue("isEstimate", checked)}
      />

      <TextareaField
        {...textFieldProps(formik, "description")}
        label="What you'll do"
        placeholder="How you'll do the job, what you'll use, and anything that sets your offer apart."
        maxLength={3000}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Check
          id="materialsIncluded"
          label="Materials included"
          checked={values.materialsIncluded}
          disabled={isSubmitting}
          onChange={(checked) => setFieldValue("materialsIncluded", checked)}
        />
        <Check
          id="labourIncluded"
          label="Labour included"
          checked={values.labourIncluded}
          disabled={isSubmitting}
          onChange={(checked) => setFieldValue("labourIncluded", checked)}
        />
      </div>

      <TextareaField
        {...textFieldProps(formik, "additionalCharges")}
        label="Anything that could cost extra (optional)"
        placeholder="e.g. Parts are extra, usually ₦3,000–₦6,000. Leave empty if there's nothing."
        maxLength={1000}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField {...textFieldProps(formik, "warranty")} label="Warranty (optional)" placeholder="e.g. 3 months on workmanship" maxLength={300} />
        <DateField
          {...fieldState(formik, "validUntil")}
          label="Offer valid until (optional)"
          disablePast
          value={values.validUntil}
          onValueChange={(date) => setFieldValue("validUntil", date)}
          onTouch={touch(formik, "validUntil")}
        />
      </div>

      <TextareaField
        {...textFieldProps(formik, "assumptions")}
        label="Assumptions (optional)"
        placeholder="e.g. The pipe behind the cabinet isn't cracked."
        maxLength={1000}
      />
    </StepForm>
  )
}

export default OfferForm
