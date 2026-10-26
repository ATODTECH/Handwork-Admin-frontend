/**
 * Query/mutation key factory — the single place keys are defined, so invalidation
 * can target a whole domain (`queryKeys.site.all`) or one entry.
 */
export const queryKeys = {
  site: {
    all: ["site"] as const,
    session: () => [...queryKeys.site.all, "session"] as const,
  },
  account: {
    all: ["account"] as const,
    bookings: () => [...queryKeys.account.all, "bookings"] as const,
    notifications: () => [...queryKeys.account.all, "notifications"] as const,
  },
} as const

export const mutationKeys = {
  admin: {
    signIn: ["admin", "sign-in"] as const,
  },
  account: {
    markNotificationRead: ["account", "notifications", "mark-read"] as const,
    startPayment: ["account", "bookings", "start-payment"] as const,
  },
  site: {
    signIn: ["site", "sign-in"] as const,
    register: ["site", "register"] as const,
    contact: ["site", "contact"] as const,
    subscribe: ["site", "subscribe"] as const,
  },
} as const
