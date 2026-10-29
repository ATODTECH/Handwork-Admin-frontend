"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./app-sidebar"
import { findActiveNavItem, type DashboardNavGroup } from "./nav"
import NotificationsMenu from "./notifications-menu"
import UserMenu from "./user-menu"

interface DashboardShellProps {
  nav: DashboardNavGroup[]
  /** Right of the header; the customer/artisan notifications and account menu by default */
  headerActions?: React.ReactNode
  /** The admin console has its own session, so it signs out differently */
  onSignOut?: () => void
  /** The "Need a hand?" support card in the sidebar */
  showSupport?: boolean
  children: React.ReactNode
}

/** Sidebar + sticky header frame shared by the customer, artisan and admin dashboards */
const DashboardShell = ({ nav, headerActions, onSignOut, showSupport, children }: DashboardShellProps) => {
  const pathname = usePathname()
  const active = findActiveNavItem(pathname, nav)

  return (
    <SidebarProvider className="font-site">
      <AppSidebar nav={nav} onSignOut={onSignOut} showSupport={showSupport} />
      <SidebarInset className="min-w-0 bg-[#F6F7FB]">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-hw-border bg-white/85 px-4 backdrop-blur-md sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-5!" />
          <span className="truncate text-sm font-medium text-hw-grey-700">{active?.title ?? "Dashboard"}</span>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {headerActions ?? (
              <>
                <NotificationsMenu />
                <UserMenu />
              </>
            )}
          </div>
        </header>
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardShell
