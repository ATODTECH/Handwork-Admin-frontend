import type { ApiError } from "@/lib/http/errors"

/**
 * Map the API's field errors (`{ api_field: [msgs] }`) onto form field names, so they
 * show under the matching inputs. Fields the map doesn't know are left to the caller.
 */
export const toFormErrors = <F extends string>(error: ApiError, fieldMap: Record<string, F>) => {
  const errors: Partial<Record<F, string>> = {}
  for (const [apiField, formField] of Object.entries(fieldMap) as [string, F][]) {
    const message = error.fieldErrors[apiField]?.[0]
    if (message) errors[formField] = message
  }
  return errors
}

/** The message to show above the submit button when an error can't be pinned to a field */
export const formLevelError = (error: ApiError | null, fieldMap: Record<string, string>) =>
  error && !Object.keys(fieldMap).some((apiField) => error.fieldErrors[apiField]?.length) ? error.message : null
