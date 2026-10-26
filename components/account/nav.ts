import type { LucideIcon } from "lucide-react"

export interface DashboardNavItem {
  title: string
  href: string
  icon: LucideIcon
  /** Match the path exactly (for an overview page whose children are other items) */
  exact?: boolean
  /** Shown but not clickable until the page exists */
  soon?: boolean
}

export interface DashboardNavGroup {
  label: string
  items: DashboardNavItem[]
}

export const isNavItemActive = (pathname: string, { href, exact }: DashboardNavItem) =>
  exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

/** The nav item for the current page, used for the header breadcrumb */
export const findActiveNavItem = (pathname: string, groups: DashboardNavGroup[]) =>
  groups.flatMap(({ items }) => items).find((item) => isNavItemActive(pathname, item))
