import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios"
import { session } from "@/lib/auth/session"
import { env } from "@/lib/env"
import { ROUTES } from "@/lib/routes"
import { toApiError } from "./errors"

declare module "axios" {
  interface AxiosRequestConfig {
    /** Don't attach the admin JWT or try to refresh it (e.g. the sign-in request itself) */
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

// ---------------------------------------------------------------------------
// Admin API — JWT bearer auth with transparent, single-flight token refresh
// ---------------------------------------------------------------------------

export const apiClient = axios.create({ ...baseConfig, baseURL: env.apiBaseUrl })

apiClient.interceptors.request.use((config) => {
  if (!config.skipAuth && isBrowser) {
    const token = session.getAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Shared by every request that hits a 401 while a refresh is already running
let refreshing: Promise<string> | null = null

const refreshAccessToken = () => {
  refreshing ??= (async () => {
    const refresh = session.getRefreshToken()
    if (!refresh) throw new Error("No refresh token")
    // Bare axios call: must not go through these interceptors
    const { data } = await axios.post<{ access: string }>(`${env.apiBaseUrl}${REFRESH_PATH}`, { refresh }, baseConfig)
    session.setAccessToken(data.access)
    return data.access
  })().finally(() => {
    refreshing = null
  })
  return refreshing
}

const endSession = () => {
  session.clear()
  if (isBrowser && window.location.pathname !== ROUTES.login) {
    const next = encodeURIComponent(window.location.pathname + window.location.search)
    // Full reload on purpose: drops every cached query belonging to the expired session
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`${ROUTES.login}?next=${next}`)
  }
}

apiClient.interceptors.response.use(undefined, async (error) => {
  const config = error?.config as InternalAxiosRequestConfig | undefined
  const canRefresh = isBrowser && error?.response?.status === 401 && config && !config.skipAuth && !config._retried

  if (canRefresh) {
    try {
      const access = await refreshAccessToken()
      config._retried = true
      config.headers.Authorization = `Bearer ${access}`
      return apiClient(config)
    } catch {
      endSession()
    }
  }
  return Promise.reject(toApiError(error))
})

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

/** Admin API (JWT) */
export const http = createHttp(apiClient)
/** Public site API (`/v2`, site key) */
export const siteHttp = createHttp(siteClient)
