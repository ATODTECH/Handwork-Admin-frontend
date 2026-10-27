"use client"

import { useFormik } from "formik"
import { CalendarDays, CalendarRange, Sun } from "lucide-react"
import ChoiceCardGroup, { type ChoiceOption } from "@/components/form/choice-card-group"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import ImageDropzone from "@/components/form/image-dropzone"
import TextareaField from "@/components/form/textarea-field"
import { useSaveSkill, useServiceOptions } from "@/hooks/account/use-artisan-onboarding"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import { IMAGE_UPLOAD, MAX_WORK_PHOTOS, servicesSchema, type ServicesFormValues } from "@/schema/validation-artisan"
import type { WorkAvailability } from "@/types/account/artisan"
import RetryHint from "./retry-hint"
import StepForm from "./step-form"

const AVAILABILITY: ChoiceOption<WorkAvailability>[] = [
  { value: "weekdays_and_weekends", label: "Any day", description: "Weekdays and weekends", icon: CalendarRange },
  { value: "weekdays_only", label: "Weekdays only", description: "Monday to Friday", icon: CalendarDays },
  { value: "weekends_only", label: "Weekends only", description: "Saturday and Sunday", icon: Sun },
]

const DESCRIPTION_MAX = 1000

const API_FIELDS: Record<string, keyof ServicesFormValues> = {
  services: "serviceIds",
  description: "description",
  base_charge: "baseCharge",
  cap_charge: "capCharge",
  image1: "photos",
  image2: "photos",
  image3: "photos",
}

const NairaAddon = <span className="text-hw-grey-700">₦</span>

/** Step 2: what the artisan does, their price range, availability and photos of past work */
const ServicesStep = () => {
  const { mutateAsync, error, isPending } = useSaveSkill()
  const services = useServiceOptions()
  const serviceOptions = (services.data ?? []).map(({ id, name }) => ({ value: id, label: name }))

  const formik = useFormik<ServicesFormValues>({
    initialValues: {
      serviceIds: [],
      description: "",
      baseCharge: "",
      capCharge: "",
      availability: "weekdays_and_weekends",
      photos: [],
    },
    validationSchema: servicesSchema,
    onSubmit: async (values, { setErrors }) => {
      const { serviceIds, description, baseCharge, capCharge, availability, photos } = servicesSchema.cast(values)
      try {
        await mutateAsync({ serviceIds, description, baseCharge, capCharge, availability, photos })
      } catch (saveError) {
        setErrors(toFormErrors(toApiError(saveError), API_FIELDS))
      }
    },
  })

  return (
    <StepForm
      onSubmit={formik.handleSubmit}
      pending={isPending}
      submitLabel="Save and continue"
      pendingLabel="Saving your services…"
      formError={formLevelError(error, API_FIELDS)}
    >
      <ComboboxField
        {...fieldState(formik, "serviceIds")}
        multiple
        label="Services you offer"
        placeholder={services.isPending ? "Loading services…" : "Search, e.g. plumbing"}
        description={
          services.isError ? (
            <RetryHint message="We couldn't load the list of services." onRetry={services.refetch} />
          ) : (
            "Pick every service you can take jobs for."
          )
        }
        disabled={formik.isSubmitting || services.isPending || services.isError}
        options={serviceOptions}
        value={formik.values.serviceIds}
        onValueChange={(ids) => formik.setFieldValue("serviceIds", ids)}
        onTouch={touch(formik, "serviceIds")}
      />

      <TextareaField
        {...textFieldProps(formik, "description")}
        label="Tell customers about your experience"
        placeholder="e.g. 8 years fixing leaks, installing water heaters and full bathroom plumbing across Lagos."
        maxLength={DESCRIPTION_MAX}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          {...textFieldProps(formik, "baseCharge", { digits: true })}
          label="Lowest charge"
          placeholder="20000"
          startAddon={NairaAddon}
          description="What a small job usually costs."
        />
        <FormField
          {...textFieldProps(formik, "capCharge", { digits: true })}
          label="Highest charge"
          placeholder="50000"
          startAddon={NairaAddon}
          description="What a big job usually costs."
        />
      </div>

      <ChoiceCardGroup
        {...fieldState(formik, "availability")}
        legend="When do you like to work?"
        options={AVAILABILITY}
        value={formik.values.availability}
        onValueChange={(value) => formik.setFieldValue("availability", value)}
        columns={3}
      />

      <ImageDropzone
        {...fieldState(formik, "photos")}
        label={
          <>
            Photos of past work <span className="font-normal text-hw-grey-500">(optional)</span>
          </>
        }
        description="Good photos help customers choose you."
        files={formik.values.photos}
        onFilesChange={(photos) => formik.setFieldValue("photos", photos)}
        onTouch={touch(formik, "photos")}
        maxFiles={MAX_WORK_PHOTOS}
        accept={IMAGE_UPLOAD.accept}
        maxBytes={IMAGE_UPLOAD.maxBytes}
        hint={IMAGE_UPLOAD.label}
      />
    </StepForm>
  )
}

export default ServicesStep
