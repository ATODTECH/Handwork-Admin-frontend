"use client"

import { useFormik } from "formik"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import TextareaField from "@/components/form/textarea-field"
import { useBookArtisan } from "@/hooks/account/use-marketplace"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import { priceRange } from "@/lib/marketplace"
import StepForm from "@/components/form/step-form"
import { bookingSchema, todayIso, type BookingFormValues } from "@/schema/validation-booking"
import type { PublicArtisan } from "@/types/account/marketplace"

const DESCRIPTION_MAX = 1000

const API_FIELDS: Record<string, keyof BookingFormValues> = {
  services: "serviceIds",
  description: "description",
  budget: "budget",
  address: "address",
  scheduled_date: "date",
  scheduled_time: "time",
}

const NairaAddon = <span className="text-hw-grey-700">₦</span>

/** The booking request: the artisan then accepts with a final price, or declines */
const BookingForm = ({ artisan }: { artisan: PublicArtisan }) => {
  const { mutateAsync, error, isPending } = useBookArtisan()
  const services = artisan.skill?.services ?? []
  const serviceOptions = services.map(({ id, name }) => ({ value: id, label: name }))

  const formik = useFormik<BookingFormValues>({
    initialValues: {
      // Nothing to choose when they only offer one service
      serviceIds: services.length === 1 ? [services[0].id] : [],
      description: "",
      budget: "",
      address: "",
      date: "",
      time: "",
    },
    validationSchema: bookingSchema,
    onSubmit: async (values, { setErrors }) => {
      const { serviceIds, description, budget, address, date, time } = bookingSchema.cast(values)
      try {
        await mutateAsync({ artisanId: artisan.id, serviceIds, description, budget, address, date, time })
      } catch (saveError) {
        setErrors(toFormErrors(toApiError(saveError), API_FIELDS))
      }
    },
  })

  return (
    <StepForm
      onSubmit={formik.handleSubmit}
      pending={isPending}
      submitLabel="Send booking request"
      pendingLabel="Sending…"
      formError={formLevelError(error, API_FIELDS)}
    >
      <ComboboxField
        {...fieldState(formik, "serviceIds")}
        multiple
        label="What do you need?"
        placeholder="Pick a service"
        options={serviceOptions}
        value={formik.values.serviceIds}
        onValueChange={(ids) => formik.setFieldValue("serviceIds", ids)}
        onTouch={touch(formik, "serviceIds")}
      />

      <TextareaField
        {...textFieldProps(formik, "description")}
        label="Describe the job"
        placeholder="e.g. Adjust two dresses and sew a kaftan for a wedding on the 20th."
        maxLength={DESCRIPTION_MAX}
      />

      <FormField
        {...textFieldProps(formik, "budget", { digits: true })}
        label="Your budget"
        placeholder="15000"
        startAddon={NairaAddon}
        description={artisan.skill && `This artisan usually charges ${priceRange(artisan.skill)}.`}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField {...textFieldProps(formik, "date")} label="Date" type="date" min={todayIso()} />
        <FormField {...textFieldProps(formik, "time")} label="Time" type="time" />
      </div>

      <FormField
        {...textFieldProps(formik, "address")}
        label="Where is the job?"
        placeholder="House number, street and area"
        autoComplete="street-address"
      />
    </StepForm>
  )
}

export default BookingForm
