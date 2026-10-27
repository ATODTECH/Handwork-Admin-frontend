"use client"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"

export interface FieldFrameProps {
  /** id of the control the label points at; also prefixes the error id */
  name: string
  label?: React.ReactNode
  description?: React.ReactNode
  /** shown only when `touched` is true, so errors don't appear before the user interacts */
  error?: string
  touched?: boolean
  className?: string
}

/** The error id a control should reference in `aria-describedby` */
export const fieldErrorId = (name: string) => `${name}-error`

/** Whether a field's error should be visible */
export const isFieldInvalid = ({ error, touched }: Pick<FieldFrameProps, "error" | "touched">) => !!touched && !!error

/** Label, hint and inline error around any form control, built on shadcn Field. */
const FieldFrame = ({ name, label, description, error, touched, className, children }: FieldFrameProps & { children: React.ReactNode }) => {
  const showError = isFieldInvalid({ error, touched })

  return (
    <Field data-invalid={showError} className={className}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      {children}
      {description && !showError && <FieldDescription>{description}</FieldDescription>}
      {showError && <FieldError id={fieldErrorId(name)}>{error}</FieldError>}
    </Field>
  )
}

export default FieldFrame
