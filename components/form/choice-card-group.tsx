"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "cn"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { fieldErrorId, isFieldInvalid } from "./field-frame"

export interface ChoiceOption<T extends string> {
  value: T
  label: string
  description?: string
  icon?: LucideIcon
}

interface ChoiceCardGroupProps<T extends string> {
  name: string
  legend: string
  options: ChoiceOption<T>[]
  value: T
  onValueChange: (value: T) => void
  error?: string
  touched?: boolean
  disabled?: boolean
  /** Grid columns from the `sm` breakpoint up */
  columns?: 1 | 2 | 3
}

const COLUMNS = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" } as const

/** A radio group drawn as selectable cards (shadcn RadioGroup + Field "choice card" pattern). */
const ChoiceCardGroup = <T extends string>({
  name,
  legend,
  options,
  value,
  onValueChange,
  error,
  touched,
  disabled,
  columns = 1,
}: ChoiceCardGroupProps<T>) => {
  const showError = isFieldInvalid({ error, touched })

  return (
    <FieldSet data-invalid={showError}>
      <FieldLegend variant="label">{legend}</FieldLegend>
      <RadioGroup
        name={name}
        value={value}
        onValueChange={(next) => onValueChange(next as T)}
        disabled={disabled}
        aria-invalid={showError}
        aria-describedby={showError ? fieldErrorId(name) : undefined}
        className={cn("grid-cols-1", COLUMNS[columns])}
      >
        {options.map(({ value: optionValue, label, description, icon: Icon }) => {
          const id = `${name}-${optionValue}`
          return (
            <FieldLabel key={optionValue} htmlFor={id} className="w-full">
              <Field orientation="horizontal">
                {Icon && (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-hw-secondary">
                    <Icon className="size-4" />
                  </span>
                )}
                <FieldContent>
                  <FieldTitle>{label}</FieldTitle>
                  {description && <FieldDescription>{description}</FieldDescription>}
                </FieldContent>
                <RadioGroupItem value={optionValue} id={id} />
              </Field>
            </FieldLabel>
          )
        })}
      </RadioGroup>
      {showError && <FieldError id={fieldErrorId(name)}>{error}</FieldError>}
    </FieldSet>
  )
}

export default ChoiceCardGroup
