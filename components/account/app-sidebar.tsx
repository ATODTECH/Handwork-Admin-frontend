"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Headset, LogOut } from "lucide-react"
import { logo } from "@/assets"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSignOut } from "@/hooks/site/use-auth"
import { isNavItemActive, type DashboardNavGroup } from "./nav"

interface AppSidebarProps {
  nav: DashboardNavGroup[]
  /** Defaults to signing out of the customer/artisan account */
  onSignOut?: () => void
  showSupport?: boolean
}

const AppSidebar = ({ nav, onSignOut, showSupport = true }: AppSidebarProps) => {
  const pathname = usePathname()
  const signOutOfAccount = useSignOut()
  const signOut = onSignOut ?? signOutOfAccount
  const { isMobile, setOpenMobile } = useSidebar()
  // On mobile the sidebar is a sheet: close it once a link is followed
  const closeOnMobile = () => isMobile && setOpenMobile(false)

  return (
    <Sidebar collapsible="icon">
      {/* On mobile the sidebar renders in a portal, outside the shell's font: re-apply it without affecting layout */}
      <div className="contents font-site">
        <SidebarHeader className="px-3 pt-5 pb-3">
          <Link href="/" className="flex items-center gap-2 overflow-hidden" aria-label="Handwork Expert home">
            <Image src={logo} alt="" className="h-9 w-auto shrink-0" priority />
            <span className="truncate text-lg font-semibold tracking-tight text-white group-data-[collapsible=icon]:hidden">
              HandworkExpert
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          {nav.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-white/40">{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        size="lg"
                        tooltip={item.title}
                        isActive={!item.soon && isNavItemActive(pathname, item)}
                        aria-disabled={item.soon}
                        // `!`: this project's `cn` doesn't merge Tailwind classes, so beat the default active colours outright
                        className="h-10 data-active:bg-sidebar-primary! data-active:text-sidebar-primary-foreground! data-active:shadow-lg data-active:shadow-black/20 group-data-[collapsible=icon]:p-2!"
                        render={item.soon ? undefined : <Link href={item.href} onClick={closeOnMobile} />}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.soon && (
                        <SidebarMenuBadge className="top-2.5! rounded-full bg-white/10 px-2 text-[10px] text-white/70">Soon</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="gap-3 p-3">
          {showSupport && <div className="relative overflow-hidden rounded-xl bg-white/6 p-4 ring-1 ring-white/10 group-data-[collapsible=icon]:hidden">
            <div className="absolute -top-6 -right-6 size-20 rounded-full bg-hw-primary/25 blur-2xl" />
            <span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-hw-primary text-white">
              <Headset className="size-4" />
            </span>
            <p className="text-sm font-semibold text-white">Need a hand?</p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">Our support team is here 7 days a week.</p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-3 w-full bg-white text-secondary-blue hover:bg-white/90"
              render={<Link href="/contact" />}
              nativeButton={false}
            >
              Contact support
            </Button>
          </div>}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sign out" onClick={signOut} className="h-10">
                <LogOut />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
