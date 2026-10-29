"use client"

import Link from "next/link"
import { BookOpenCheck, Landmark, ShieldCheck, TrendingUp, UserRoundCheck, Users, Wallet } from "lucide-react"
import BookingStatusBadge from "@/components/account/bookings/booking-status-badge"
import EmptyState from "@/components/account/empty-state"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import StatCard from "@/components/account/stat-card"
import ViewAllLink from "@/components/account/view-all-link"
import { PageHeader } from "@/components/shared/page-header"
import { UseAvatar } from "@/components/shared/use-avatar"
import VerificationBadge from "@/components/shared/verification-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import { useAdminOverview } from "@/hooks/admin/use-overview"
import { formatActivityDate, formatCount, formatNairaAmount } from "@/lib/format"
import { formatLocation } from "@/lib/locations"
import { ROUTES } from "@/lib/routes"
import type { AdminOverview } from "@/types/admin/overview"

/** "Up 20% on last month", for a stat card's hint */
const monthOnMonth = (thisMonth: number, lastMonth: number) => {
  if (!lastMonth) return thisMonth ? "None last month" : "Nothing yet this month"
  const change = Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
  if (!change) return "Same as last month"
  return `${change > 0 ? "Up" : "Down"} ${Math.abs(change)}% on last month`
}

const Row = ({ media, title, description, aside }: { media: React.ReactNode, title: React.ReactNode, description: React.ReactNode, aside: React.ReactNode }) => (
  <Item variant="outline" className="rounded-xl bg-white">
    <ItemMedia>{media}</ItemMedia>
    <ItemContent className="min-w-0 gap-1">
      <ItemTitle className="text-sm font-semibold text-hw-grey-900">{title}</ItemTitle>
      <ItemDescription className="truncate text-xs">{description}</ItemDescription>
    </ItemContent>
    <ItemActions className="flex-col items-end gap-1.5 text-right">{aside}</ItemActions>
  </Item>
)

const ListCard = <T,>({ title, description, href, linkLabel, items, empty, render, query }: {
  title: string
  description: string
  href: string
  linkLabel: string
  items: T[]
  empty: string
  render: (item: T) => React.ReactNode
  query: { isPending: boolean, isError: boolean, refetch: () => void }
}) => (
  <SectionCard title={title} description={description} action={<ViewAllLink href={href} label={linkLabel} />} className="min-w-0">
    <QueryContent
      isPending={query.isPending}
      isError={query.isError}
      onRetry={query.refetch}
      isEmpty={!items.length}
      empty={<EmptyState icon={ShieldCheck} title="All clear" description={empty} className="p-6" />}
    >
      <ItemGroup className="gap-3">{items.map(render)}</ItemGroup>
    </QueryContent>
  </SectionCard>
)

const Stats = ({ data, loading }: { data?: AdminOverview, loading: boolean }) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
    <StatCard
      label="Revenue this month"
      value={data && formatNairaAmount(data.revenue.this_month)}
      hint={data ? `${monthOnMonth(Number(data.revenue.this_month), Number(data.revenue.last_month))} · our 10% fee` : undefined}
      icon={TrendingUp}
      tone="success"
      loading={loading}
    />
    <StatCard
      label="Held for customers"
      value={data && formatNairaAmount(data.held.amount)}
      hint={data && `${formatCount(data.held.bookings)} paid jobs waiting for confirmation`}
      icon={Landmark}
      tone="info"
      loading={loading}
    />
    <StatCard
      label="Customers"
      value={data && formatCount(data.customers.total)}
      hint={data && `${formatCount(data.customers.new_this_month)} new this month`}
      icon={Users}
      tone="brand"
      loading={loading}
    />
    <StatCard
      label="Approved artisans"
      value={data && formatCount(data.artisans.approved)}
      hint={data && `${formatCount(data.artisans.awaiting_review)} awaiting review · ${formatCount(data.artisans.onboarding)} onboarding`}
      icon={UserRoundCheck}
      tone="warning"
      loading={loading}
    />
    <StatCard
      label="Bookings this month"
      value={data && formatCount(data.bookings.this_month)}
      hint={data && `${monthOnMonth(data.bookings.this_month, data.bookings.last_month)} · ${formatCount(data.bookings.active)} active`}
      icon={BookOpenCheck}
      tone="neutral"
      loading={loading}
    />
  </div>
)

/** Staff home: the marketplace at a glance, and what's waiting on staff */
const DashboardOverview = () => {
  const heading = usePageHeading()
  const overview = useAdminOverview()
  const data = overview.data
  const pendingWithdrawals = data?.withdrawals.pending ?? 0

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={heading?.title ?? "Dashboard"}
        description="The marketplace at a glance, and what's waiting on you."
        action={
          <Button render={<Link href={ROUTES.artisans} />} nativeButton={false}>
            <ShieldCheck data-icon="inline-start" />
            Review artisans
          </Button>
        }
      />

      <Stats data={data} loading={overview.isPending} />

      <div className="grid gap-6 xl:grid-cols-2">
        <ListCard
          title="Artisans awaiting review"
          description={data ? `${formatCount(data.artisans.awaiting_review)} finished onboarding and can't take jobs until approved.` : "Finished onboarding, waiting for approval."}
          href={ROUTES.artisans}
          linkLabel="Review"
          items={data?.artisans_awaiting_review ?? []}
          empty="No artisans are waiting for review."
          query={overview}
          render={(artisan) => (
            <Row
              key={artisan.id}
              media={<UseAvatar src="" name={artisan.name} aspectRatio="size-10" className="text-sm" />}
              title={artisan.name}
              description={[artisan.services.join(", ") || "No services yet", formatLocation(artisan)].filter(Boolean).join(" · ")}
              aside={<time dateTime={artisan.submitted_at} className="text-xs text-hw-grey-500">{formatActivityDate(artisan.submitted_at)}</time>}
            />
          )}
        />
        <ListCard
          title="Withdrawals awaiting approval"
          description={pendingWithdrawals ? `${formatCount(pendingWithdrawals)} totalling ${formatNairaAmount(data?.withdrawals.pending_amount ?? 0)}.` : "Artisans' requests to be paid out."}
          href={ROUTES.payouts}
          linkLabel="Payouts"
          items={data?.withdrawals_awaiting_approval ?? []}
          empty="No withdrawals are waiting for approval."
          query={overview}
          render={(withdrawal) => (
            <Row
              key={withdrawal.id}
              media={
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-hw-secondary">
                  <Wallet className="size-5" />
                </span>
              }
              title={withdrawal.artisan}
              description={`To ${withdrawal.bank_name} · ${formatActivityDate(withdrawal.requested_at)}`}
              aside={<span className="text-sm font-semibold text-hw-grey-900 tabular-nums">{formatNairaAmount(withdrawal.amount)}</span>}
            />
          )}
        />
        <ListCard
          title="Recent bookings"
          description="The latest requests customers made."
          href={ROUTES.bookings}
          linkLabel="Bookings"
          items={data?.recent_bookings ?? []}
          empty="No bookings yet."
          query={overview}
          render={(booking) => (
            <Row
              key={booking.id}
              media={
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#FEF1ED] text-hw-primary">
                  <BookOpenCheck className="size-5" />
                </span>
              }
              title={booking.services.join(", ") || "Service request"}
              description={`${booking.customer} → ${booking.artisan ?? "No artisan"} · ${formatActivityDate(booking.created_at)}`}
              aside={
                <>
                  <span className="text-sm font-semibold text-hw-grey-900 tabular-nums">{formatNairaAmount(booking.amount)}</span>
                  <BookingStatusBadge status={booking.status} />
                </>
              }
            />
          )}
        />
        <ListCard
          title="Recent sign-ups"
          description="New customers and artisans, newest first."
          href={ROUTES.users}
          linkLabel="Users"
          items={data?.recent_users ?? []}
          empty="Nobody has signed up yet."
          query={overview}
          render={(user) => (
            <Row
              key={user.id}
              media={<UseAvatar src="" name={user.name} aspectRatio="size-10" className="text-sm" />}
              title={user.name}
              description={`${user.email} · ${formatActivityDate(user.date_joined)}`}
              aside={
                user.verification_status ? (
                  <VerificationBadge status={user.verification_status} />
                ) : (
                  <Badge variant="secondary">Customer</Badge>
                )
              }
            />
          )}
        />
      </div>
    </section>
  )
}

export default DashboardOverview
