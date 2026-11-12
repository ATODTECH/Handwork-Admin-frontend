"use client"

import { useState } from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { BadgeCheck, BellRing, CheckCheck, ChevronRight, CircleAlert, Flag, Headset, UserRoundCheck, Wallet, WalletCards } from "lucide-react"
import { cn } from "cn"
import EmptyState from "@/components/account/empty-state"
import { ListSkeleton } from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { NOTIFICATION_DAYS, useAdminNotifications, useSeenNotifications } from "@/hooks/admin/use-notifications"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import { formatActivityDate } from "@/lib/format"
import { ROUTES } from "@/lib/routes"
import { SEMANTIC_TONES, type SemanticTone } from "@/lib/tones"
import type { StaffNotification, StaffNotificationKind, StaffNotificationPage } from "@/types/admin/notifications"

const KINDS: Record<StaffNotificationKind, { icon: LucideIcon, tone: SemanticTone, label: string }> = {
  ARTISAN_REVIEW: { icon: UserRoundCheck, tone: "info", label: "Artisans to review" },
  PROBLEM_REPORTED: { icon: CircleAlert, tone: "danger", label: "Problems to settle" },
  PROBLEM_SETTLED: { icon: BadgeCheck, tone: "success", label: "Problems settled" },
  WITHDRAWAL_REQUESTED: { icon: Wallet, tone: "warning", label: "Payouts to approve" },
  PAYOUT_FAILED: { icon: WalletCards, tone: "danger", label: "Failed payouts" },
  REPORT: { icon: Flag, tone: "brand", label: "Reports to review" },
  SUPPORT: { icon: Headset, tone: "info", label: "Support requests" },
}

const PAGES: Record<StaffNotificationPage, string> = {
  artisans: ROUTES.artisans,
  bookings: ROUTES.bookings,
  payouts: ROUTES.payouts,
  "reported-content": ROUTES.reportedContent,
  support: ROUTES.support,
}

type View = "action" | "all"

const NotificationRow = ({ notification, unseen, onOpen }: { notification: StaffNotification, unseen: boolean, onOpen: () => void }) => {
  const { icon: Icon, tone } = KINDS[notification.kind]
  return (
    <li className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", SEMANTIC_TONES[tone].icon)}>
        <Icon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {unseen && <span className="size-2 shrink-0 rounded-full bg-hw-primary" aria-label="New" />}
          <span className={cn("text-sm text-hw-grey-900", unseen ? "font-semibold" : "font-medium")}>{notification.title}</span>
          {notification.needs_action && (
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", SEMANTIC_TONES.warning.chip)}>Needs action</span>
          )}
        </div>
        {notification.detail && <p className="line-clamp-2 text-xs text-hw-grey-700">{notification.detail}</p>}
        <time dateTime={notification.at} className="text-xs text-hw-grey-500">{formatActivityDate(notification.at)}</time>
      </div>
      <Button variant="ghost" size="sm" className="shrink-0" render={<Link href={PAGES[notification.link.page]} onClick={onOpen} />} nativeButton={false}>
        Open
        <ChevronRight data-icon="inline-end" />
      </Button>
    </li>
  )
}

/** What staff need to deal with, and what happened recently, from across the console */
const StaffNotificationsIndex = () => {
  const heading = usePageHeading()
  const [view, setView] = useState<View>("action")
  const { data, isPending, isError, refetch } = useAdminNotifications(NOTIFICATION_DAYS)
  const { seen, markSeen } = useSeenNotifications()
  const items = data?.items ?? []
  const shown = view === "action" ? items.filter(({ needs_action }) => needs_action) : items
  const unseenIds = items.filter(({ id }) => !seen.has(id)).map(({ id }) => id)
  const waiting = Object.entries(data?.needs_action_by_kind ?? {}) as [StaffNotificationKind, number][]

  return (
    <section className="flex flex-col gap-6">
      <PageHeader title={heading?.title ?? "Notifications"} description={heading?.description ?? "What needs your attention."} action={null} />

      {waiting.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Waiting on staff">
          {waiting.map(([kind, count]) => {
            const { icon: Icon, label } = KINDS[kind]
            return (
              <span key={kind} className="flex items-center gap-1.5 rounded-full border border-hw-border bg-white px-3 py-1.5 text-xs text-hw-grey-700">
                <Icon className="size-3.5" />
                {label}
                <span className="font-semibold text-hw-grey-900 tabular-nums">{count}</span>
              </span>
            )
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          label="Show"
          tabs={[
            { label: "Needs action", value: "action", count: data?.needs_action },
            { label: `Last ${NOTIFICATION_DAYS} days`, value: "all", count: items.length },
          ]}
          value={view}
          onChange={setView}
          className="w-fit"
        />
        <Button variant="outline" size="sm" disabled={!unseenIds.length} onClick={() => markSeen(unseenIds)}>
          <CheckCheck data-icon="inline-start" />
          Mark all as seen
        </Button>
      </div>

      <SectionCard title={view === "action" ? "Waiting on staff" : "Recent activity"}>
        {isPending ? (
          <ListSkeleton rows={5} />
        ) : isError ? (
          <EmptyState icon={BellRing} title="Couldn't load notifications" description="Check your connection and try again." action={<Button onClick={() => refetch()}>Try again</Button>} />
        ) : shown.length ? (
          <ul className="flex flex-col divide-y divide-hw-border">
            {shown.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                unseen={!seen.has(notification.id)}
                onOpen={() => markSeen([notification.id])}
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={BellRing}
            title={view === "action" ? "Nothing waiting" : "No activity yet"}
            description={
              view === "action"
                ? "New artisans to review, problems, payouts and reports will show up here."
                : `Nothing happened in the last ${NOTIFICATION_DAYS} days.`
            }
          />
        )}
      </SectionCard>
      <p className="text-xs text-hw-grey-500">Seen and unseen is remembered in this browser only. Items waiting on staff stay here until they&apos;re dealt with.</p>
    </section>
  )
}

export default StaffNotificationsIndex
