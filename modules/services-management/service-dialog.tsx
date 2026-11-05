"use client"

import { useFormik } from "formik"
import { toast } from "sonner"
import * as Yup from "yup"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import SubmitButton from "@/components/form/submit-button"
import TextareaField from "@/components/form/textarea-field"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateService, useUpdateService } from "@/hooks/admin/use-services"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import type { AdminCategory, AdminService } from "@/types/admin/services"

const schema = Yup.object({
  name: Yup.string().trim().required("Give the service a name").min(2, "Give the service a name").max(250, "Keep it under 250 characters"),
  description: Yup.string().trim().required("Describe what the service covers").max(500, "Keep it under 500 characters"),
  categoryId: Yup.number().nullable().required("Choose a category"),
})

interface FormValues {
  name: string
  description: string
  categoryId: number | null
}

const API_FIELDS: Record<string, keyof FormValues> = { name: "name", description: "description", categories: "categoryId" }

interface ServiceFormProps {
  service: AdminService | null
  categories: AdminCategory[]
  onClose: () => void
}

const ServiceForm = ({ service, categories, onClose }: ServiceFormProps) => {
  const create = useCreateService()
  const update = useUpdateService({ silentError: true })
  const isPending = create.isPending || update.isPending
  const saveError = create.error ?? update.error

  const formik = useFormik<FormValues>({
    initialValues: {
      name: service?.name ?? "",
      description: service?.description ?? "",
      categoryId: service?.categories[0] ?? null,
    },
    validationSchema: schema,
    onSubmit: async (values, { setErrors }) => {
      const { name, description, categoryId } = schema.cast(values)
      const payload = { name, description, categories: categoryId === null ? [] : [categoryId] }
      try {
        if (service) await update.mutateAsync({ id: service.id, ...payload })
        else await create.mutateAsync(payload)
        toast.success(service ? `${name} is saved.` : `${name} has been added.`)
        onClose()
      } catch (error) {
        setErrors(toFormErrors(toApiError(error), API_FIELDS))
      }
    },
  })

  const formError = saveError ? formLevelError(toApiError(saveError), API_FIELDS) : null

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle>{service ? `Edit ${service.name}` : "Add a service"}</DialogTitle>
        <DialogDescription>Artisans choose from these when they sign up, and customers book them.</DialogDescription>
      </DialogHeader>

      <FormField {...textFieldProps(formik, "name")} label="Name" placeholder="e.g. Tiling" maxLength={250} disabled={isPending} />
      <ComboboxField
        {...fieldState(formik, "categoryId")}
        label="Category"
        placeholder="Choose a category"
        options={categories.map(({ id, name }) => ({ value: id, label: name }))}
        value={formik.values.categoryId}
        onValueChange={(categoryId) => formik.setFieldValue("categoryId", categoryId)}
        onTouch={touch(formik, "categoryId")}
        disabled={isPending}
      />
      <TextareaField {...textFieldProps(formik, "description")} label="Description" placeholder="What does it cover?" maxLength={500} rows={3} disabled={isPending} />

      {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
        <SubmitButton size="default" pending={isPending} pendingText="Saving…">{service ? "Save changes" : "Add service"}</SubmitButton>
      </DialogFooter>
    </form>
  )
}

interface ServiceDialogProps extends Omit<ServiceFormProps, "onClose"> {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Add or edit a service */
const ServiceDialog = ({ open, onOpenChange, service, categories }: ServiceDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-lg">
      {/* key: each opening starts from the chosen service */}
      <ServiceForm key={service?.id ?? "new"} service={service} categories={categories} onClose={() => onOpenChange(false)} />
    </DialogContent>
  </Dialog>
)

export default ServiceDialog
