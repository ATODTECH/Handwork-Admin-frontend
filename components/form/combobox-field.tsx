"use client"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import FieldFrame, { fieldErrorId, isFieldInvalid, type FieldFrameProps } from "./field-frame"

export interface ComboboxOption<V extends string | number> {
  value: V
  label: string
}

interface BaseProps<V extends string | number> extends Omit<FieldFrameProps, "className"> {
  options: ComboboxOption<V>[]
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  /** Called when the popup closes, so the form can mark the field touched */
  onTouch?: () => void
}

type ComboboxFieldProps<V extends string | number> = BaseProps<V> &
  (
    | { multiple: true, value: V[], onValueChange: (value: V[]) => void }
    | { multiple?: false, value: V | null, onValueChange: (value: V | null) => void }
  )

const toLabel = <V extends string | number>(option: ComboboxOption<V>) => option.label
const isSameOption = <V extends string | number>(a: ComboboxOption<V>, b: ComboboxOption<V>) => a.value === b.value

/** Searchable select (single) or tag picker (multiple), built on shadcn Combobox. */
const ComboboxField = <V extends string | number>(props: ComboboxFieldProps<V>) => {
  const { name, label, description, error, touched, options, placeholder, emptyText = "No matches found.", disabled, onTouch } = props
  const anchor = useComboboxAnchor()
  const showError = isFieldInvalid({ error, touched })
  const controlProps = {
    id: name,
    "aria-invalid": showError,
    "aria-describedby": showError ? fieldErrorId(name) : undefined,
  }
  const shared = {
    items: options,
    itemToStringLabel: toLabel<V>,
    isItemEqualToValue: isSameOption<V>,
    disabled,
    onOpenChange: (open: boolean) => {
      if (!open) onTouch?.()
    },
  }

  const list = (
    <>
      <ComboboxEmpty>{emptyText}</ComboboxEmpty>
      <ComboboxList>
        {(option: ComboboxOption<V>) => (
          <ComboboxItem key={option.value} value={option}>
            {option.label}
          </ComboboxItem>
        )}
      </ComboboxList>
    </>
  )

  return (
    <FieldFrame name={name} label={label} description={description} error={error} touched={touched}>
      {props.multiple ? (
        <Combobox
          {...shared}
          multiple
          value={options.filter((option) => props.value.includes(option.value))}
          onValueChange={(selected: ComboboxOption<V>[]) => props.onValueChange(selected.map((option) => option.value))}
        >
          <ComboboxChips ref={anchor} className="min-h-11">
            <ComboboxValue>
              {(selected: ComboboxOption<V>[]) => (
                <>
                  {selected.map((option) => (
                    <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput {...controlProps} placeholder={selected.length ? undefined : placeholder} />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>{list}</ComboboxContent>
        </Combobox>
      ) : (
        <Combobox
          {...shared}
          value={options.find((option) => option.value === props.value) ?? null}
          onValueChange={(selected: ComboboxOption<V> | null) => props.onValueChange(selected?.value ?? null)}
        >
          <ComboboxInput {...controlProps} placeholder={placeholder} disabled={disabled} className="h-11 w-full" />
          <ComboboxContent>{list}</ComboboxContent>
        </Combobox>
      )}
    </FieldFrame>
  )
}

export default ComboboxField
