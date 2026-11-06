"use client"

import { useFormik } from "formik"
import StepForm from "@/components/form/step-form"
import { useSaveSkill } from "@/hooks/account/use-artisan-onboarding"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import { servicesSchema, type ServicesFormValues } from "@/schema/validation-artisan"
import SkillFields, { SKILL_API_FIELDS } from "../skill-fields"

/** Step 2: what the artisan does, their price range, availability and photos of past work */
const ServicesStep = () => {
  const { mutateAsync, error, isPending } = useSaveSkill()

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
        setErrors(toFormErrors(toApiError(saveError), SKILL_API_FIELDS))
      }
    },
  })

  return (
    <StepForm
      onSubmit={formik.handleSubmit}
      pending={isPending}
      submitLabel="Save and continue"
      pendingLabel="Saving your services…"
      formError={formLevelError(error, SKILL_API_FIELDS)}
    >
      <SkillFields formik={formik} />
    </StepForm>
  )
}

export default ServicesStep
