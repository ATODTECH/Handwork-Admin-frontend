"use client"

import { useFormik } from "formik"
import { CreditCard, IdCard, ScanFace } from "lucide-react"
import ChoiceCardGroup, { type ChoiceOption } from "@/components/form/choice-card-group"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import ImageDropzone from "@/components/form/image-dropzone"
import { useSaveIdentity } from "@/hooks/account/use-artisan-onboarding"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import { IMAGE_UPLOAD, identitySchema, type IdentityFormValues } from "@/schema/validation-artisan"
import type { IdDocumentType } from "@/types/account/artisan"
import StepForm from "./step-form"

const DOCUMENT_TYPES: ChoiceOption<IdDocumentType>[] = [
  { value: "NIN", label: "NIN slip or card", icon: ScanFace },
  { value: "DL", label: "Driver's licence", icon: CreditCard },
  { value: "PSP", label: "International passport", icon: IdCard },
]

const API_FIELDS: Record<string, keyof IdentityFormValues> = {
  nin: "nin",
  document_type: "documentType",
  document: "document",
}

/** Step 1: NIN and a photo of a government ID */
const IdentityStep = () => {
  const { mutateAsync, error, isPending } = useSaveIdentity()

  const formik = useFormik<IdentityFormValues>({
    initialValues: { nin: "", documentType: "NIN", document: null },
    validationSchema: identitySchema,
    onSubmit: async (values, { setErrors }) => {
      const { nin, documentType, document } = identitySchema.cast(values)
      try {
        await mutateAsync({ nin, documentType, document })
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
      pendingLabel="Uploading…"
      formError={formLevelError(error, API_FIELDS)}
    >
      <FormField
        {...textFieldProps(formik, "nin", { digits: true })}
        label="National Identification Number (NIN)"
        placeholder="11-digit NIN"
        maxLength={11}
        description="Dial *346# on your registered line to get it."
      />

      <ChoiceCardGroup
        {...fieldState(formik, "documentType")}
        legend="Which ID are you uploading?"
        options={DOCUMENT_TYPES}
        value={formik.values.documentType}
        onValueChange={(value) => formik.setFieldValue("documentType", value)}
        columns={3}
      />

      <ImageDropzone
        {...fieldState(formik, "document")}
        label="Photo of your ID"
        description="Make sure all four corners are visible and the text is readable."
        files={formik.values.document ? [formik.values.document] : []}
        onFilesChange={([file]) => formik.setFieldValue("document", file ?? null)}
        onTouch={touch(formik, "document")}
        accept={IMAGE_UPLOAD.accept}
        maxBytes={IMAGE_UPLOAD.maxBytes}
        hint={IMAGE_UPLOAD.label}
      />
    </StepForm>
  )
}

export default IdentityStep
