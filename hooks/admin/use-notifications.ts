import { useCallback, useSyncExternalStore } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { adminNotificationsQuery } from "@/services/admin/notifications"

export const NOTIFICATION_DAYS = 30

export const useAdminNotifications = (days = NOTIFICATION_DAYS) =>
  useQuery({ ...adminNotificationsQuery(days), placeholderData: keepPreviousData })

/*
 * Which notifications this staff member has seen. There's no notification table on the API, so it's kept in
 * this browser: a convenience, not a record. Anything still waiting on staff stays listed until it's dealt with.
 */
const STORAGE_KEY = "hw-admin-seen-notifications"
const MAX_REMEMBERED = 500
const listeners = new Set<() => void>()
let cache: string | null = null

const read = (): string => {
  if (cache !== null) return cache
  try {
    cache = window.localStorage.getItem(STORAGE_KEY) ?? "[]"
  } catch {
    cache = "[]"
  }
  return cache
}

const write = (ids: string[]) => {
  cache = JSON.stringify(ids.slice(-MAX_REMEMBERED))
  try {
    window.localStorage.setItem(STORAGE_KEY, cache)
  } catch {
    // Private window or blocked storage: remembered until the page reloads
  }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const parse = (raw: string): string[] => {
  try {
    const value: unknown = JSON.parse(raw)
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : []
  } catch {
    return []
  }
}

export const useSeenNotifications = () => {
  const raw = useSyncExternalStore(subscribe, read, () => "[]")
  const seen = new Set(parse(raw))
  const markSeen = useCallback((ids: string[]) => {
    const current = parse(read())
    const fresh = ids.filter((id) => !current.includes(id))
    if (fresh.length) write([...current, ...fresh])
  }, [])
  return { seen, markSeen }
}
