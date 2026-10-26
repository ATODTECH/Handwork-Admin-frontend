import { UserRole } from "@/types/site/my-account";
import { usePathname } from "next/navigation"


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
  reports: "/admin/dashboard/reports",
  support: "/admin/dashboard/support",
  notifications: "/admin/dashboard/notifications",
  settings: "/admin/dashboard/settings",
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