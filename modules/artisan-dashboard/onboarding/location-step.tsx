"use client"

import { useFormik } from "formik"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import { useSaveLocation } from "@/hooks/account/use-artisan-onboarding"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import { NIGERIAN_STATES } from "@/lib/locations"
import { locationSchema, type LocationFormValues } from "@/schema/validation-artisan"
import StepForm from "@/components/form/step-form"

const STATE_OPTIONS = NIGERIAN_STATES.map((state) => ({ value: state, label: state }))

const API_FIELDS: Record<string, keyof LocationFormValues> = {
  state: "state",
  city: "city",
  address: "address",
}

interface LocationStepProps {
  submitLabel?: string
}

/** Step 2: where the artisan is based. Also used on the dashboard by artisans who signed up without one */
const LocationStep = ({ submitLabel = "Save and continue" }: LocationStepProps) => {
  const { mutateAsync, error, isPending } = useSaveLocation()

  const formik = useFormik<LocationFormValues>({
    initialValues: { state: "", city: "", address: "" },
    validationSchema: locationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await mutateAsync(locationSchema.cast(values))
      } catch (saveError) {
        setErrors(toFormErrors(toApiError(saveError), API_FIELDS))
      }
    },
  })

  return (
    <StepForm
      onSubmit={formik.handleSubmit}
      pending={isPending}
      submitLabel={submitLabel}
      pendingLabel="Saving your location…"
      formError={formLevelError(error, API_FIELDS)}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <ComboboxField
          {...fieldState(formik, "state")}
          label="State"
          placeholder="Search for your state"
          options={STATE_OPTIONS}
          value={formik.values.state || null}
          onValueChange={(state) => formik.setFieldValue("state", state ?? "")}
          onTouch={touch(formik, "state")}
        />
        <FormField
          {...textFieldProps(formik, "city")}
          label="City or area"
          placeholder="e.g. Ikeja"
          maxLength={40}
          autoComplete="address-level2"
        />
      </div>

      <FormField
        {...textFieldProps(formik, "address")}
        label="Address"
        placeholder="Street, or a landmark close to you"
        description="Only staff see your address. Customers see your city and state."
        maxLength={250}
        autoComplete="street-address"
      />
    </StepForm>
  )
}

export default LocationStep
