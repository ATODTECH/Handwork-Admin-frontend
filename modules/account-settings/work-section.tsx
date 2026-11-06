"use client"

import { useState } from "react"
import { useFormik } from "formik"
import { toast } from "sonner"
import StepForm from "@/components/form/step-form"
import { useUpdateSkill } from "@/hooks/account/use-artisan-onboarding"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import SkillFields, { SKILL_API_FIELDS } from "@/modules/artisan-dashboard/skill-fields"
import { servicesSchema, type ServicesFormValues, type ServicesValues } from "@/schema/validation-artisan"
import type { ArtisanSkill, SkillPhotoSlot, WorkAvailability } from "@/types/account/artisan"

const PHOTO_SLOTS: SkillPhotoSlot[] = ["image1", "image2", "image3"]
const AVAILABILITY_FLAGS: WorkAvailability[] = ["weekdays_only", "weekends_only", "weekdays_and_weekends"]

/** Decimal strings from the API, as whole naira for the form */
const toFormAmount = (amount: string) => String(Math.round(Number(amount)))

const savedPhotoSlots = (skill: ArtisanSkill) => PHOTO_SLOTS.filter((slot) => skill[slot])

const toFormValues = (skill: ArtisanSkill): ServicesFormValues => ({
  serviceIds: skill.services.map(({ id }) => id),
  description: skill.description,
  baseCharge: toFormAmount(skill.base_charge),
  capCharge: toFormAmount(skill.cap_charge),
  availability: AVAILABILITY_FLAGS.find((flag) => skill[flag]) ?? "weekdays_and_weekends",
  photos: [],
})

const sameIds = (a: number[], b: number[]) => a.length === b.length && a.every((id) => b.includes(id))

/** Only what changed goes to the API. New photos fill the free slots; "" clears a photo that was removed */
const changedFields = (skill: ArtisanSkill, values: ServicesValues, keptSlots: SkillPhotoSlot[]) => {
  const current = toFormValues(skill)
  const body = new FormData()

  if (!sameIds(values.serviceIds, current.serviceIds)) body.append("services", JSON.stringify(values.serviceIds))
  if (values.description !== current.description) body.append("description", values.description)
  if (String(values.baseCharge) !== current.baseCharge) body.append("base_charge", String(values.baseCharge))
  if (String(values.capCharge) !== current.capCharge) body.append("cap_charge", String(values.capCharge))
  if (values.availability !== current.availability) {
    for (const flag of AVAILABILITY_FLAGS) body.append(flag, String(flag === values.availability))
  }

  const newPhotos = [...values.photos]
  for (const slot of PHOTO_SLOTS) {
    if (keptSlots.includes(slot)) continue
    const photo = newPhotos.shift()
    if (photo) body.append(slot, photo)
    else if (skill[slot]) body.append(slot, "")
  }
  return body
}

/** An artisan's services, prices, work days and photos. Saving after a rejection sends them back to staff */
const WorkSection = ({ skill }: { skill: ArtisanSkill }) => {
  const { mutateAsync, error, isPending } = useUpdateSkill()
  const [keptSlots, setKeptSlots] = useState(() => savedPhotoSlots(skill))

  const formik = useFormik<ServicesFormValues>({
    initialValues: toFormValues(skill),
    validationSchema: servicesSchema,
    onSubmit: async (values, { setErrors, resetForm }) => {
      const changes = changedFields(skill, servicesSchema.cast(values), keptSlots)
      if ([...changes.keys()].length === 0) {
        toast("Nothing to save: you haven't changed anything.")
        return
      }
      try {
        const saved = await mutateAsync({ id: skill.id, changes })
        resetForm({ values: toFormValues(saved) })
        setKeptSlots(savedPhotoSlots(saved))
        toast.success("Your services are saved.")
      } catch (saveError) {
        setErrors(toFormErrors(toApiError(saveError), SKILL_API_FIELDS))
      }
    },
  })

  return (
    <StepForm
      onSubmit={formik.handleSubmit}
      pending={isPending}
      submitLabel="Save changes"
      pendingLabel="Saving…"
      formError={formLevelError(error ? toApiError(error) : null, SKILL_API_FIELDS)}
    >
      <SkillFields
        formik={formik}
        currentServices={skill.services}
        existingPhotos={keptSlots.map((slot, index) => ({ key: slot, url: skill[slot] ?? "", label: `Work photo ${index + 1}` }))}
        onRemoveExistingPhoto={(slot) => setKeptSlots((slots) => slots.filter((kept) => kept !== slot))}
      />
    </StepForm>
  )
}

export default WorkSection
