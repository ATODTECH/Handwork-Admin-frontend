export const ROUTES = {
  login: "/admin/login",
  dashboard: "/admin/dashboard/overview",
  users: "/admin/dashboard/users",
  artisans: "/admin/dashboard/artisans",
  services: "/admin/dashboard/services",
  bookings: "/admin/dashboard/bookings",
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
  /** Single entry point: redirects to the signed-in role's own dashboard */
  dashboard: "/dashboard",
  customerHome: "/dashboard/customer",
  customerBookings: "/dashboard/customer/bookings",
  artisanHome: "/dashboard/artisan",
  artisanOnboarding: "/dashboard/artisan/onboarding",
} as const

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
  [ROUTES.users]: { title: "User Management" },
  [ROUTES.artisans]: { title: "Artisans" },
  [ROUTES.services]: { title: "Services", description: "Services And Category Management" },
  [ROUTES.bookings]: { title: "Bookings" },
  [ROUTES.reports]: { title: "Reports", description: "Review marketplace performance and download detailed reports." },
  [ROUTES.support]: { title: "Support" },
  [ROUTES.notifications]: { title: "Notifications", description: "Stay on top of approvals, bookings, payments and support activity." },
  [ROUTES.settings]: { title: "Settings", description: "Manage platform details, admin access, payments and notification preferences." },
}
