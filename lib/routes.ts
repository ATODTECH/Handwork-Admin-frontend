import { UserRole } from "@/types/site/my-account";

export const ROUTESITE = {
  profile: (role: UserRole) => `/my-account/${role}/profile` as const,
  address: (role: UserRole) => `/my-account/${role}/address` as const,
} as const;


export const ROUTES = {
  login: "/admin/login",
  dashboard: "/admin/dashboard/overview",
  users: "/admin/dashboard/users",
  artisans: "/admin/dashboard/artisans",
  services: "/admin/dashboard/services",
  bookings: "/admin/dashboard/bookings",
  payouts: "/admin/dashboard/payouts",
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
  customerArtisans: "/dashboard/customer/artisans",
  customerMessages: "/dashboard/customer/messages",
  customerSettings: "/dashboard/customer/settings",
  artisanHome: "/dashboard/artisan",
  artisanJobs: "/dashboard/artisan/jobs",
  artisanEarnings: "/dashboard/artisan/earnings",
  artisanMessages: "/dashboard/artisan/messages",
  artisanSettings: "/dashboard/artisan/settings",
  artisanOnboarding: "/dashboard/artisan/onboarding",
} as const

/** An artisan's profile and booking form, for customers */
export const customerArtisanRoute = (id: string) => `${ACCOUNT_ROUTES.customerArtisans}/${id}` as const

/** Messages, opened on one booking's conversation when `bookingId` is given */
export const messagesRoute = (viewer: "customer" | "artisan", bookingId?: number) => {
  const base = viewer === "customer" ? ACCOUNT_ROUTES.customerMessages : ACCOUNT_ROUTES.artisanMessages
  return bookingId ? `${base}?booking=${bookingId}` : base
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
  [ROUTES.reports]: { title: "Reports", description: "Review marketplace performance and download detailed reports." },
  [ROUTES.support]: { title: "Support" },
  [ROUTES.notifications]: { title: "Notifications", description: "Stay on top of approvals, bookings, payments and support activity." },
  [ROUTES.settings]: { title: "Settings", description: "Manage platform details, admin access, payments and notification preferences." },
}
