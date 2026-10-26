"use client"

import { BadgeCheck, Bell, Banknote, CalendarCheck, CreditCard, KeyRound, PackageOpen, PartyPopper, Star, ToggleRight, Wrench, type LucideIcon } from "lucide-react"
import { cn } from "cn"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { useMarkNotificationRead, useNotifications } from "@/hooks/account/use-dashboard"
import { formatActivityDate } from "@/lib/format"
import { SEMANTIC_TONES, type SemanticTone } from "@/lib/tones"
import EmptyState from "./empty-state"
import QueryContent, { ListSkeleton } from "./query-content"

// Every `notification_type` the API creates
const TYPE_STYLE: Record<string, { icon: LucideIcon, tone: SemanticTone, title: string }> = {
  BOOKING: { icon: CalendarCheck, tone: "info", title: "Booking update" },
  PAYMENT: { icon: CreditCard, tone: "success", title: "Payment" },
  MATERIAL_REQUEST: { icon: PackageOpen, tone: "warning", title: "Materials request" },
  AVAILABILITY: { icon: ToggleRight, tone: "neutral", title: "Availability" },
  SIGNUP: { icon: PartyPopper, tone: "brand", title: "Welcome aboard" },
  PASSWORD_RESET: { icon: KeyRound, tone: "warning", title: "Security" },
  RATING: { icon: Star, tone: "warning", title: "New rating" },
  BANK_DETAILS: { icon: Banknote, tone: "success", title: "Payments" },
  SKILL: { icon: Wrench, tone: "info", title: "Profile" },
}
const DEFAULT_STYLE = { icon: Bell, tone: "info" as const, title: "Update" }

interface NotificationListProps {
  /** Show only the newest n */
  limit?: number
  className?: string
}

const NotificationList = ({ limit, className }: NotificationListProps) => {
  const { data = [], isPending, isError, refetch } = useNotifications()
  const { mutate: markRead } = useMarkNotificationRead()
  const items = [...data]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)

  return (
    <QueryContent
      isPending={isPending}
      isError={isError}
      onRetry={refetch}
      isEmpty={!items.length}
      skeleton={<ListSkeleton rows={limit ?? 3} />}
      empty={<EmptyState icon={BadgeCheck} title="You're all caught up" description="Booking updates and payment receipts will show up here." />}
    >
      <ItemGroup className={cn("gap-1", className)}>
        {items.map((notification) => {
          const style = TYPE_STYLE[notification.notification_type] ?? DEFAULT_STYLE
          return (
            <Item
              key={notification.id}
              size="sm"
              render={<button type="button" />}
              onClick={() => !notification.is_read && markRead(notification.id)}
              className={cn("w-full cursor-pointer items-start text-left hover:bg-muted/60", !notification.is_read && "bg-[#FEF1ED]/50")}
            >
              <ItemMedia className={cn("size-9 rounded-lg", SEMANTIC_TONES[style.tone].icon)}>
                <style.icon className="size-4" />
              </ItemMedia>
              <ItemContent className="gap-0.5">
                <ItemTitle className="w-full justify-between text-[13px] text-hw-grey-900">
                  {style.title}
                  {!notification.is_read && <span className="size-2 rounded-full bg-hw-primary" aria-label="Unread" />}
                </ItemTitle>
                <ItemDescription className="line-clamp-2 text-xs">{notification.message}</ItemDescription>
                <span className="text-[11px] text-hw-grey-500">{formatActivityDate(notification.created_at)}</span>
              </ItemContent>
            </Item>
          )
        })}
      </ItemGroup>
    </QueryContent>
  )
}

export default NotificationList
