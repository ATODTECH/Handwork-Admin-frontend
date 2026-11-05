"use client"

import { useFormik } from "formik"
import { toast } from "sonner"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import StepForm from "@/components/form/step-form"
import { useUpdateProfile } from "@/hooks/account/use-profile"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import { COUNTRY, NIGERIAN_STATES } from "@/lib/locations"
import {
  artisanProfileSchema,
  customerProfileSchema,
  toInternationalContact,
  type ProfileFormValues,
} from "@/schema/validation-account"
import type { AccountDetails, AccountDetailsUpdate } from "@/types/account/profile"

const STATE_OPTIONS = NIGERIAN_STATES.map((state) => ({ value: state, label: state }))

const API_FIELDS: Record<string, keyof ProfileFormValues> = {
  first_name: "firstName",
  last_name: "lastName",
  contact: "contact",
  state: "state",
  city: "city",
  address: "address",
}

/**
 * Only what changed goes to the API: saving a new phone number shouldn't count as a rejected
 * artisan resubmitting their location. The API wants null, not "", for an empty location.
 */
const changedFields = (values: ProfileFormValues, details: AccountDetails) => {
  const next = {
    first_name: values.firstName,
    last_name: values.lastName,
    contact: toInternationalContact(values.contact),
    state: values.state || null,
    city: values.city || null,
    address: values.address || null,
  }
  const changes: AccountDetailsUpdate = Object.fromEntries(
    Object.entries(next).filter(([field, value]) => value !== details[field as keyof typeof next]),
  )
  if ("state" in changes) changes.country = changes.state ? COUNTRY : null
  return changes
}

interface DetailsFormProps {
  details: AccountDetails
  isArtisan: boolean
}

/** Name, phone and location. The email is the sign-in, so it's shown but not edited here */
const DetailsForm = ({ details, isArtisan }: DetailsFormProps) => {
  const { save, error, isPending } = useUpdateProfile()
  const schema = isArtisan ? artisanProfileSchema : customerProfileSchema

  const formik = useFormik<ProfileFormValues>({
    enableReinitialize: true,
    initialValues: {
      firstName: details.first_name,
      lastName: details.last_name,
      contact: details.contact,
      state: details.state ?? "",
      city: details.city ?? "",
      address: details.address ?? "",
    },
    validationSchema: schema,
    onSubmit: async (values, { setErrors }) => {
      const changes = changedFields(schema.cast(values) as ProfileFormValues, details)
      if (!Object.keys(changes).length) {
        toast("Nothing to save: you haven't changed anything.")
        return
      }
      try {
        await save(changes)
        toast.success("Your details are saved.")
      } catch (saveError) {
        setErrors(toFormErrors(toApiError(saveError), API_FIELDS))
      }
    },
  })

  return (
    <StepForm
      onSubmit={formik.handleSubmit}
      pending={isPending}
      submitLabel="Save changes"
      pendingLabel="Saving…"
      formError={formLevelError(error ? toApiError(error) : null, API_FIELDS)}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField {...textFieldProps(formik, "firstName")} label="First name" autoComplete="given-name" disabled={isPending} />
        <FormField {...textFieldProps(formik, "lastName")} label="Last name" autoComplete="family-name" disabled={isPending} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          name="email"
          label="Email"
          type="email"
          value={details.email}
          description="You sign in with this. Contact support to change it."
          disabled
        />
        <FormField
          {...textFieldProps(formik, "contact")}
          label="Phone number"
          type="tel"
          autoComplete="tel"
          description="Shared with the other person once a job is paid for."
          maxLength={15}
          disabled={isPending}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <ComboboxField
          {...fieldState(formik, "state")}
          label="State"
          placeholder="Search for your state"
          options={STATE_OPTIONS}
          value={formik.values.state || null}
          onValueChange={(state) => formik.setFieldValue("state", state ?? "")}
          onTouch={touch(formik, "state")}
          disabled={isPending}
        />
        <FormField {...textFieldProps(formik, "city")} label="City or area" placeholder="e.g. Ikeja" maxLength={40} autoComplete="address-level2" disabled={isPending} />
      </div>

      <FormField
        {...textFieldProps(formik, "address")}
        label="Address"
        placeholder="Street, or a landmark close to you"
        description={isArtisan ? "Only staff see your address. Customers see your city and state." : undefined}
        maxLength={250}
        autoComplete="street-address"
        disabled={isPending}
      />
    </StepForm>
  )
}

export default DetailsForm
