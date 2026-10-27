"use client"

import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"
import FieldFrame, { fieldErrorId, isFieldInvalid, type FieldFrameProps } from "./field-frame"

type TextareaFieldProps = Omit<React.ComponentProps<typeof InputGroupTextarea>, "id"> & Omit<FieldFrameProps, "className">

/** Labelled multi-line input; shows a character counter when `maxLength` is set. */
const TextareaField = ({ name, label, description, error, touched, maxLength, value, ...textareaProps }: TextareaFieldProps) => {
  const showError = isFieldInvalid({ error, touched })
  const length = typeof value === "string" ? value.length : 0

  return (
    <FieldFrame name={name} label={label} description={description} error={error} touched={touched}>
      <InputGroup>
        <InputGroupTextarea
          id={name}
          name={name}
          value={value}
          maxLength={maxLength}
          aria-invalid={showError}
          aria-describedby={showError ? fieldErrorId(name) : undefined}
          className="min-h-28"
          {...textareaProps}
        />
        {maxLength && (
          <InputGroupAddon align="block-end">
            <InputGroupText className="ml-auto text-xs tabular-nums" aria-live="polite">
              {length}/{maxLength}
            </InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
    </FieldFrame>
  )
}

export default TextareaField
