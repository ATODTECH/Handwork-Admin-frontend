"use client"

import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/hooks/account/use-dashboard"
import NotificationList from "./notification-list"

const NotificationsMenu = () => {
  const { unread } = useNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="relative rounded-full" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} />}
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-hw-primary text-[10px] font-semibold text-white ring-2 ring-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-88 p-0">
        <div className="flex items-center justify-between border-b border-hw-border px-4 py-3">
          <span className="text-sm font-semibold text-hw-grey-900">Notifications</span>
          {unread > 0 && <Badge variant="secondary">{unread} new</Badge>}
        </div>
        <ScrollArea className="max-h-96">
          <div className="p-2">
            <NotificationList limit={8} />
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationsMenu
