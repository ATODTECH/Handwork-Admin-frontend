import { AxiosError, isAxiosError } from "axios"

export type FieldErrors = Record<string, string[]>

/** The one error type every request rejects with, so UI code never has to inspect axios internals. */
export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: FieldErrors
  readonly body: unknown
  /** No answer within the timeout: the server may still have done the work */
  readonly timedOut: boolean

  constructor(message: string, { status = 0, fieldErrors = {}, body = null, timedOut = false }: {
    status?: number
    fieldErrors?: FieldErrors
    body?: unknown
    timedOut?: boolean
  } = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.fieldErrors = fieldErrors
    this.body = body
    this.timedOut = timedOut
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isNetworkError() {
    return this.status === 0
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError

type Json = Record<string, unknown>

const isObject = (value: unknown): value is Json =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const toStringList = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : typeof value === "string" ? [value] : []

/**
 * DRF errors arrive as `{ detail }` or `{ field: [msgs] }`; the API's exception handler
 * may also wrap them as `{ status, message, data: <drf error> }`. Unwrap both.
 */
const parseBody = (body: unknown) => {
  const payload = isObject(body) && isObject(body.data) ? body.data : body
  if (!isObject(payload)) return { message: undefined, fieldErrors: {} }

  const fieldErrors: FieldErrors = {}
  for (const [key, value] of Object.entries(payload)) {
    if (key === "detail" || key === "non_field_errors") continue
    const messages = toStringList(value)
    if (messages.length) fieldErrors[key] = messages
  }

  const message =
    toStringList(payload.detail)[0] ??
    toStringList(payload.non_field_errors)[0] ??
    Object.values(fieldErrors)[0]?.[0] ??
    (isObject(body) && typeof body.message === "string" ? body.message : undefined)

  return { message, fieldErrors }
}

export const toApiError = (error: unknown): ApiError => {
  if (isApiError(error)) return error

  if (isAxiosError(error)) {
    const axiosError = error as AxiosError
    if (axiosError.code === AxiosError.ECONNABORTED || axiosError.code === AxiosError.ETIMEDOUT) {
      return new ApiError("The request timed out. Please try again.", { timedOut: true })
    }
    if (!axiosError.response) {
      // Network failure, DNS error, CORS block, etc.
      return new ApiError("Couldn't reach the server. Check your connection and try again.")
    }

    const { status, data } = axiosError.response
    const { message, fieldErrors } = parseBody(data)
    return new ApiError(message ?? `Request failed (${status}).`, { status, fieldErrors, body: data })
  }

  return new ApiError(error instanceof Error ? error.message : "Something went wrong.")
}
