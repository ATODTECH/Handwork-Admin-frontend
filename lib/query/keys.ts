/**
 * Query/mutation key factory — the single place keys are defined, so invalidation
 * can target a whole domain (`queryKeys.site.all`) or one entry.
 */
export const queryKeys = {
  site: {
    all: ["site"] as const,
    session: () => [...queryKeys.site.all, "session"] as const,
  },
} as const

export const mutationKeys = {
  admin: {
    signIn: ["admin", "sign-in"] as const,
  },
  site: {
    signIn: ["site", "sign-in"] as const,
    register: ["site", "register"] as const,
    contact: ["site", "contact"] as const,
    subscribe: ["site", "subscribe"] as const,
  },
} as const
