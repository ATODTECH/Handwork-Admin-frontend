"use client"

import Link from "next/link"
import { ChevronDown, Globe, LogOut, UserRoundCog } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAccountDetails } from "@/hooks/account/use-profile"
import { useAccountProfile, useSignOut } from "@/hooks/site/use-auth"
import { initials } from "@/lib/format"
import { ACCOUNT_ROUTES } from "@/lib/routes"

const ROLE_LABEL = { USER: "Customer account", ARTISAN: "Artisan account" } as const

const UserMenu = () => {
  const profile = useAccountProfile()
  const { data: details } = useAccountDetails()
  const signOut = useSignOut()
  const name = profile?.name || "My account"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-10 gap-2 rounded-full px-1.5 sm:pr-3" />}>
        <Avatar className="size-8">
          {details?.profile_image && <AvatarImage src={details.profile_image} alt="" />}
          <AvatarFallback className="bg-secondary-blue text-xs font-semibold text-white">{initials(name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-36 truncate text-sm font-medium text-hw-grey-900 sm:inline">{name}</span>
        <ChevronDown className="hidden size-4 text-hw-grey-500 sm:inline" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="truncate text-sm font-semibold text-hw-grey-900">{name}</span>
            {profile && <span className="text-xs font-normal text-hw-grey-500">{ROLE_LABEL[profile.role]}</span>}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {profile && (
          <DropdownMenuItem render={<Link href={profile.role === "USER" ? ACCOUNT_ROUTES.customerSettings : ACCOUNT_ROUTES.artisanSettings} />}>
            <UserRoundCog />
            Profile &amp; settings
          </DropdownMenuItem>
        )}
        <DropdownMenuItem render={<Link href="/" />}>
          <Globe />
          Back to website
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={signOut}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
