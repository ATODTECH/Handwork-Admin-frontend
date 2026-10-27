import type { FormikProps } from "formik"

type StringKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T] & string

/** Validation state for any field, in the shape the form components take */
export const fieldState = <T>(formik: FormikProps<T>, name: keyof T & string) => ({
  name,
  error: formik.errors[name] as string | undefined,
  touched: !!formik.touched[name],
  disabled: formik.isSubmitting,
})

/**
 * Everything a text `FormField` / `TextareaField` needs from Formik.
 * `digits` strips anything but 0-9 as the user types (NIN, BVN, account numbers, amounts).
 */
export const textFieldProps = <T>(formik: FormikProps<T>, name: StringKeys<T>, { digits = false } = {}) => ({
  ...fieldState(formik, name),
  value: formik.values[name] as string,
  onBlur: formik.handleBlur,
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    formik.setFieldValue(name, digits ? event.target.value.replace(/\D/g, "") : event.target.value),
  ...(digits && { inputMode: "numeric" as const, autoComplete: "off" }),
})

/** Mark a non-input field (radio, combobox, file) as touched without re-validating everything */
export const touch = <T>(formik: FormikProps<T>, name: keyof T & string) => () => {
  if (!formik.touched[name]) void formik.setFieldTouched(name, true)
}
