/**
 * Query/mutation key factory — the single place keys are defined, so invalidation
 * can target a whole domain (`queryKeys.site.all`) or one entry.
 */
export const queryKeys = {
  admin: {
    all: ["admin"] as const,
    artisansRoot: () => [...queryKeys.admin.all, "artisans"] as const,
    artisans: (status: string) => [...queryKeys.admin.artisansRoot(), status] as const,
    artisanCounts: () => [...queryKeys.admin.artisansRoot(), "counts"] as const,
    overview: () => [...queryKeys.admin.all, "overview"] as const,
    withdrawalsRoot: () => [...queryKeys.admin.all, "withdrawals"] as const,
    withdrawals: (status: string) => [...queryKeys.admin.withdrawalsRoot(), status] as const,
    withdrawalCounts: () => [...queryKeys.admin.withdrawalsRoot(), "counts"] as const,
  },
  site: {
    all: ["site"] as const,
    session: () => [...queryKeys.site.all, "session"] as const,
  },
  account: {
    all: ["account"] as const,
    bookings: () => [...queryKeys.account.all, "bookings"] as const,
    notifications: () => [...queryKeys.account.all, "notifications"] as const,
    artisanProfile: (id: string) => [...queryKeys.account.all, "artisan-profile", id] as const,
    serviceOptions: () => [...queryKeys.account.all, "service-options"] as const,
    banks: () => [...queryKeys.account.all, "banks"] as const,
    artisans: () => [...queryKeys.account.all, "artisans"] as const,
    artisan: (id: string) => [...queryKeys.account.artisans(), id] as const,
    categories: () => [...queryKeys.account.all, "categories"] as const,
    wallet: () => [...queryKeys.account.all, "wallet"] as const,
  },
} as const

export const mutationKeys = {
  admin: {
    signIn: ["admin", "sign-in"] as const,
    approveArtisan: ["admin", "artisans", "approve"] as const,
    rejectArtisan: ["admin", "artisans", "reject"] as const,
    approveWithdrawal: ["admin", "withdrawals", "approve"] as const,
    rejectWithdrawal: ["admin", "withdrawals", "reject"] as const,
  },
  account: {
    markNotificationRead: ["account", "notifications", "mark-read"] as const,
    payBooking: ["account", "bookings", "pay"] as const,
    confirmBooking: ["account", "bookings", "confirm"] as const,
    bookArtisan: ["account", "bookings", "book-artisan"] as const,
    updateJob: ["account", "bookings", "update-job"] as const,
    requestWithdrawal: ["account", "wallet", "withdraw"] as const,
    updateBankDetails: ["account", "wallet", "bank-details"] as const,
    saveIdentity: ["account", "onboarding", "identity"] as const,
    saveLocation: ["account", "onboarding", "location"] as const,
    saveSkill: ["account", "onboarding", "skill"] as const,
    saveBankDetails: ["account", "onboarding", "bank-details"] as const,
  },
  site: {
    signIn: ["site", "sign-in"] as const,
    register: ["site", "register"] as const,
    contact: ["site", "contact"] as const,
    subscribe: ["site", "subscribe"] as const,
  },
} as const
