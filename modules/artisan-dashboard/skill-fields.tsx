"use client"

import type { FormikProps } from "formik"
import { CalendarDays, CalendarRange, Sun } from "lucide-react"
import ChoiceCardGroup, { type ChoiceOption } from "@/components/form/choice-card-group"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import ImageDropzone, { type ExistingImage } from "@/components/form/image-dropzone"
import TextareaField from "@/components/form/textarea-field"
import { useServiceOptions } from "@/hooks/account/use-artisan-onboarding"
import { IMAGE_UPLOAD, MAX_WORK_PHOTOS, type ServicesFormValues } from "@/schema/validation-artisan"
import type { ServiceOption, WorkAvailability } from "@/types/account/artisan"
import RetryHint from "./onboarding/retry-hint"

const AVAILABILITY: ChoiceOption<WorkAvailability>[] = [
  { value: "weekdays_and_weekends", label: "Any day", description: "Weekdays and weekends", icon: CalendarRange },
  { value: "weekdays_only", label: "Weekdays only", description: "Monday to Friday", icon: CalendarDays },
  { value: "weekends_only", label: "Weekends only", description: "Saturday and Sunday", icon: Sun },
]

const DESCRIPTION_MAX = 1000

/** Where the API's field errors show on the form */
export const SKILL_API_FIELDS: Record<string, keyof ServicesFormValues> = {
  services: "serviceIds",
  description: "description",
  base_charge: "baseCharge",
  cap_charge: "capCharge",
  image1: "photos",
  image2: "photos",
  image3: "photos",
}

const NairaAddon = <span className="text-hw-grey-700">₦</span>

interface SkillFieldsProps {
  formik: FormikProps<ServicesFormValues>
  /** Services the artisan already offers: staff may have hidden one since, and they keep it until they remove it */
  currentServices?: ServiceOption[]
  /** Saved photos, which count towards the limit */
  existingPhotos?: ExistingImage[]
  onRemoveExistingPhoto?: (key: string) => void
}

/** What the artisan does, their price range, availability and photos: onboarding and Profile & settings */
const SkillFields = ({ formik, currentServices = [], existingPhotos, onRemoveExistingPhoto }: SkillFieldsProps) => {
  const services = useServiceOptions()
  const offered = services.data ?? []
  const serviceOptions = [...offered, ...currentServices.filter(({ id }) => !offered.some((service) => service.id === id))].map(
    ({ id, name }) => ({ value: id, label: name }),
  )

  return (
    <>
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
        existing={existingPhotos}
        onRemoveExisting={onRemoveExistingPhoto}
        onTouch={touch(formik, "photos")}
        maxFiles={MAX_WORK_PHOTOS}
        accept={IMAGE_UPLOAD.accept}
        maxBytes={IMAGE_UPLOAD.maxBytes}
        hint={IMAGE_UPLOAD.label}
      />
    </>
  )
}

export default SkillFields
