"use client"

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export type FormFieldProps = Omit<React.ComponentProps<typeof InputGroupInput>, "id"> & {
  name: string
  label?: string
  description?: string
  /** shown only when `touched` is true, so errors don't appear before the user interacts */
  error?: string
  touched?: boolean
  /** e.g. an icon, rendered before the input */
  startAddon?: React.ReactNode
  /** e.g. a button, rendered after the input */
  endAddon?: React.ReactNode
}

/** Labelled input with inline validation, built on shadcn Field + InputGroup. */
const FormField = ({
  name,
  label,
  description,
  error,
  touched,
  startAddon,
  endAddon,
  ...inputProps
}: FormFieldProps) => {
  const showError = !!touched && !!error
  const errorId = `${name}-error`

  return (
    <Field data-invalid={showError}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <InputGroup className="h-11">
        {startAddon && <InputGroupAddon>{startAddon}</InputGroupAddon>}
        <InputGroupInput
          id={name}
          name={name}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : undefined}
          {...inputProps}
        />
        {endAddon && <InputGroupAddon align="inline-end">{endAddon}</InputGroupAddon>}
      </InputGroup>
      {description && !showError && <FieldDescription>{description}</FieldDescription>}
      {showError && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  )
}

export default FormField
