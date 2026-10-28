"use client"

import { ArrowRight, CircleAlert } from "lucide-react"
import SubmitButton from "@/components/form/submit-button"
import { FieldGroup } from "@/components/ui/field"

interface StepFormProps {
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void
  pending: boolean
  submitLabel: string
  pendingLabel: string
  /** A save error that isn't about one field (network, permissions, ...) */
  formError?: string | null
  children: React.ReactNode
}

/** Shared frame for a form: the fields, a form-level error and the submit button (onboarding steps, booking) */
const StepForm = ({ onSubmit, pending, submitLabel, pendingLabel, formError, children }: StepFormProps) => (
  <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6" aria-busy={pending}>
    <FieldGroup className="gap-6">{children}</FieldGroup>

    {formError && (
      <p role="alert" className="flex items-start gap-2 rounded-lg bg-[#FFF0EF] px-3 py-2.5 text-sm text-[#C2271D]">
        <CircleAlert className="mt-0.5 size-4 shrink-0" />
        {formError}
      </p>
    )}

    <div className="flex justify-end border-t border-hw-border pt-5">
      <SubmitButton pending={pending} pendingText={pendingLabel} className="h-11 w-full px-5 sm:w-auto">
        {submitLabel}
        {!pending && <ArrowRight data-icon="inline-end" />}
      </SubmitButton>
    </div>
  </form>
)

export default StepForm
