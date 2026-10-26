import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios"
import { accountSession, session, type TokenStore } from "@/lib/auth/session"
import { env } from "@/lib/env"
import { ACCOUNT_ROUTES, ROUTES } from "@/lib/routes"
import { toApiError } from "./errors"

declare module "axios" {
  interface AxiosRequestConfig {
    /** Don't attach the JWT or try to refresh it (e.g. the sign-in request itself) */
    skipAuth?: boolean
    /** Internal: set once a request has been retried after a token refresh */
    _retried?: boolean
  }
}

const DEFAULT_TIMEOUT_MS = 30_000
const REFRESH_PATH = "/api/token/refresh/"

const baseConfig = {
  timeout: DEFAULT_TIMEOUT_MS,
  headers: { Accept: "application/json" },
} satisfies AxiosRequestConfig

const isBrowser = typeof window !== "undefined"

/**
 * The API's response middleware wraps every DRF body as `{ status, message, data }`.
 * Return the inner `data` so callers get the payload the endpoint actually describes.
 */
const unwrapEnvelope = (body: unknown) =>
  typeof body === "object" && body !== null && "data" in body && typeof (body as { status?: unknown }).status === "boolean"
    ? (body as { data: unknown }).data
    : body

// ---------------------------------------------------------------------------
// JWT clients — bearer auth with transparent, single-flight token refresh
// ---------------------------------------------------------------------------

const createAuthClient = (tokens: TokenStore, loginRoute: string) => {
  const client = axios.create({ ...baseConfig, baseURL: env.apiBaseUrl })

  client.interceptors.request.use((config) => {
    if (!config.skipAuth && isBrowser) {
      const token = tokens.getAccessToken()
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Shared by every request that hits a 401 while a refresh is already running
  let refreshing: Promise<string> | null = null

  const refreshAccessToken = () => {
    refreshing ??= (async () => {
      const refresh = tokens.getRefreshToken()
      if (!refresh) throw new Error("No refresh token")
      // Bare axios call: must not go through these interceptors
      const { data } = await axios.post(`${env.apiBaseUrl}${REFRESH_PATH}`, { refresh }, baseConfig)
      const { access } = unwrapEnvelope(data) as { access?: string }
      if (!access) throw new Error("Refresh returned no access token")
      tokens.setAccessToken(access)
      return access
    })().finally(() => {
      refreshing = null
    })
    return refreshing
  }

  const endSession = () => {
    tokens.clear()
    if (isBrowser && window.location.pathname !== loginRoute) {
      const next = encodeURIComponent(window.location.pathname + window.location.search)
      // Full reload on purpose: drops every cached query belonging to the expired session
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`${loginRoute}?next=${next}`)
    }
  }

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      response.data = unwrapEnvelope(response.data)
      return response
    },
    async (error) => {
      const config = error?.config as InternalAxiosRequestConfig | undefined
      const canRefresh = isBrowser && error?.response?.status === 401 && config && !config.skipAuth && !config._retried

      if (canRefresh) {
        try {
          const access = await refreshAccessToken()
          config._retried = true
          config.headers.Authorization = `Bearer ${access}`
          return client(config)
        } catch {
          endSession()
        }
      }
      return Promise.reject(toApiError(error))
    },
  )

  return client
}

/** Admin staff API */
export const apiClient = createAuthClient(session, ROUTES.login)

/** Customer/artisan API */
export const accountClient = createAuthClient(accountSession, ACCOUNT_ROUTES.login)

// ---------------------------------------------------------------------------
// Public site API (`/v2`) — shared site key + Django session cookie
// ---------------------------------------------------------------------------

export const siteClient = axios.create({
  ...baseConfig,
  baseURL: `${env.apiBaseUrl}/v2`,
  withCredentials: true,
  headers: {
    ...baseConfig.headers,
    ...(env.siteApiKey && { Authorization: `Bearer ${env.siteApiKey}` }),
  },
})

siteClient.interceptors.response.use(undefined, (error) => Promise.reject(toApiError(error)))

// ---------------------------------------------------------------------------
// Typed helpers that resolve to the response body
// ---------------------------------------------------------------------------

const createHttp = (instance: AxiosInstance) => ({
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.get<T>(url, config).then((res) => res.data),
  post: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    instance.post<T>(url, body, config).then((res) => res.data),
  put: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    instance.put<T>(url, body, config).then((res) => res.data),
  patch: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    instance.patch<T>(url, body, config).then((res) => res.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<T>(url, config).then((res) => res.data),
})

/** Admin API (JWT, unwrapped) */
export const http = createHttp(apiClient)
/** Customer/artisan API (JWT, unwrapped) */
export const accountHttp = createHttp(accountClient)
/** Public site API (`/v2`, site key) */
export const siteHttp = createHttp(siteClient)
