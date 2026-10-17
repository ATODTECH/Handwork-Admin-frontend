import { usePathname } from "next/navigation"

export const ROUTES = {
  login: "/login",
  dashboard: "/dashboard/overview",
  users: "/dashboard/users",
  artisans: "/dashboard/artisans",
  services: "/dashboard/services",
  bookings: "/dashboard/bookings",
  reports: "/dashboard/reports",
  support: "/dashboard/support",
  notifications: "/dashboard/notifications",
  settings: "/dashboard/settings",
} as const

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

export const HeaderPage = () => {
  const pathname = usePathname()
  return (PAGE_HEADINGS[pathname])
}