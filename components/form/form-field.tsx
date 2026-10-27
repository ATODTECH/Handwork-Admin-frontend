"use client"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import FieldFrame, { fieldErrorId, isFieldInvalid, type FieldFrameProps } from "./field-frame"

export type FormFieldProps = Omit<React.ComponentProps<typeof InputGroupInput>, "id"> &
  Omit<FieldFrameProps, "className"> & {
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
  const showError = isFieldInvalid({ error, touched })

  return (
    <FieldFrame name={name} label={label} description={description} error={error} touched={touched}>
      <InputGroup className="h-11">
        {startAddon && <InputGroupAddon>{startAddon}</InputGroupAddon>}
        <InputGroupInput
          id={name}
          name={name}
          aria-invalid={showError}
          aria-describedby={showError ? fieldErrorId(name) : undefined}
          {...inputProps}
        />
        {endAddon && <InputGroupAddon align="inline-end">{endAddon}</InputGroupAddon>}
      </InputGroup>
    </FieldFrame>
  )
}

export default FormField
