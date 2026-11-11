export const ROUTES = {
  login: "/admin/login",
  dashboard: "/admin/dashboard/overview",
  users: "/admin/dashboard/users",
  artisans: "/admin/dashboard/artisans",
  services: "/admin/dashboard/services",
  bookings: "/admin/dashboard/bookings",
  payouts: "/admin/dashboard/payouts",
  reportedContent: "/admin/dashboard/reported-content",
  requests: "/admin/dashboard/requests",
  reports: "/admin/dashboard/reports",
  support: "/admin/dashboard/support",
  notifications: "/admin/dashboard/notifications",
  settings: "/admin/dashboard/settings",
} as const

/**
 * Customer/artisan account routes
 */
export const ACCOUNT_ROUTES = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  /** Single entry point: redirects to the signed-in role's own dashboard */
  dashboard: "/dashboard",
  customerHome: "/dashboard/customer",
  customerBookings: "/dashboard/customer/bookings",
  customerRequests: "/dashboard/customer/requests",
  customerNewRequest: "/dashboard/customer/requests/new",
  customerArtisans: "/dashboard/customer/artisans",
  customerMessages: "/dashboard/customer/messages",
  customerPayments: "/dashboard/customer/payments",
  customerSettings: "/dashboard/customer/settings",
  artisanHome: "/dashboard/artisan",
  artisanJobs: "/dashboard/artisan/jobs",
  artisanFindWork: "/dashboard/artisan/requests",
  artisanOffers: "/dashboard/artisan/offers",
  artisanSchedule: "/dashboard/artisan/schedule",
  artisanEarnings: "/dashboard/artisan/earnings",
  artisanReviews: "/dashboard/artisan/reviews",
  artisanMessages: "/dashboard/artisan/messages",
  artisanSettings: "/dashboard/artisan/settings",
  artisanOnboarding: "/dashboard/artisan/onboarding",
} as const

/** An artisan's profile and booking form, for customers */
export const customerArtisanRoute = (id: string) => `${ACCOUNT_ROUTES.customerArtisans}/${id}` as const

/** "Request a quote": a private request to one provider */
export const requestQuoteRoute = (providerId: string) => `${ACCOUNT_ROUTES.customerNewRequest}?provider=${encodeURIComponent(providerId)}` as const

/** One of the customer's requests, with its offers */
export const customerRequestRoute = (id: number) => `${ACCOUNT_ROUTES.customerRequests}/${id}` as const

/** Editing a request that hasn't had an offer accepted */
export const customerEditRequestRoute = (id: number) => `${ACCOUNT_ROUTES.customerRequests}/${id}/edit` as const

/** A customer's request as a provider sees it, with their offer */
export const artisanRequestRoute = (id: number) => `${ACCOUNT_ROUTES.artisanFindWork}/${id}` as const

/** Identifies a conversation in Messages: a booking's, or a request's with one provider */
export const bookingChatKey = (bookingId: number) => `b${bookingId}`
export const requestChatKey = (requestId: number, providerId: string) => `r${requestId}-${providerId}`
export const REQUEST_CHAT_KEY = /^r\d+-[0-9a-fA-F-]{32,36}$/

/** Messages, opened on one conversation: `?booking=12` for a booking's, `?chat=r3-…` for a request's */
export const messagesRoute = (viewer: "customer" | "artisan", conversationKey?: string) => {
  const base = viewer === "customer" ? ACCOUNT_ROUTES.customerMessages : ACCOUNT_ROUTES.artisanMessages
  if (!conversationKey) return base
  return conversationKey.startsWith("b") ? `${base}?booking=${conversationKey.slice(1)}` : `${base}?chat=${conversationKey}`
}

/** Where each role lands after signing in */
export const accountHome = (role: "USER" | "ARTISAN", onboarded: boolean) =>
  role === "USER" ? ACCOUNT_ROUTES.customerHome : onboarded ? ACCOUNT_ROUTES.artisanHome : ACCOUNT_ROUTES.artisanOnboarding

/** The area a role is allowed into, used to vet `?next=` redirects */
export const accountArea = (role: "USER" | "ARTISAN") =>
  role === "USER" ? ACCOUNT_ROUTES.customerHome : ACCOUNT_ROUTES.artisanHome

/**
 * Admin navigation routes
 */
export const PAGE_HEADINGS: Record<string, { title: string, description?: string }> = {
  [ROUTES.dashboard]: { title: "Dashboard" },
  [ROUTES.users]: { title: "User Management", description: "Find any account, and deactivate one if you need to." },
  [ROUTES.artisans]: { title: "Artisans", description: "Review new artisans before customers can find and book them." },
  [ROUTES.services]: { title: "Services", description: "The services artisans can offer. Hidden services stay with artisans who already offer them, but new artisans can't choose them and they leave the category lists." },
  [ROUTES.bookings]: { title: "Bookings", description: "Follow every booking, and settle problems customers report by paying the artisan or refunding the customer." },
  [ROUTES.payouts]: { title: "Payouts", description: "Approve artisans' withdrawals. Approving sends the money to their bank through Paystack." },
  [ROUTES.requests]: { title: "Requests and offers", description: "Every request customers post, with the offers artisans send. Close a request or withdraw an offer that breaks our rules; the people involved are told why. Once an offer is accepted, the Bookings page takes over." },
  [ROUTES.reportedContent]: { title: "Reported content", description: "Accounts, requests, offers, messages, bookings and reviews people reported. Dismiss a report, or act on it and remove what was reported. Reporters are told the outcome, never who handled it." },
  [ROUTES.reports]: { title: "Reports", description: "Review marketplace performance and download detailed reports." },
  [ROUTES.support]: { title: "Support" },
  [ROUTES.notifications]: { title: "Notifications", description: "Stay on top of approvals, bookings, payments and support activity." },
  [ROUTES.settings]: { title: "Settings", description: "Manage platform details, admin access, payments and notification preferences." },
}
