"use client"

import { useState } from "react"
import Link from "next/link"
import { CircleDollarSign, CreditCard, RotateCcw, ShieldCheck } from "lucide-react"
import { cn } from "cn"
import BookingDetailsSheet from "@/components/account/bookings/booking-details-sheet"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import StatCard from "@/components/account/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item"
import { useMyBookings } from "@/hooks/account/use-dashboard"
import { bookingPayments, bookingTitle, PAYMENT_STATES, summarizePayments, type BookingPayment } from "@/lib/bookings"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import { SEMANTIC_TONES } from "@/lib/tones"

const PaymentRow = ({ payment, onOpen }: { payment: BookingPayment, onOpen: () => void }) => {
  const { booking, amount, state, paidAt } = payment
  const { label, tone, hint } = PAYMENT_STATES[state]
  const { chip, dot } = SEMANTIC_TONES[tone]

  return (
    <Item variant="outline" className="rounded-xl bg-white">
      <ItemContent className="min-w-0 gap-1">
        <ItemTitle className="text-sm font-semibold text-hw-grey-900">{bookingTitle(booking)}</ItemTitle>
        <ItemDescription className="text-xs">
          {booking.artisan} · <time dateTime={paidAt}>{formatActivityDate(paidAt)}</time>
          <span className="block">
            {state === "refunded" && booking.resolved_at ? `Refunded ${formatActivityDate(booking.resolved_at)}. ` : ""}
            {hint}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions className="w-full flex-wrap justify-between gap-2 sm:w-auto sm:flex-col sm:items-end">
        <span className={cn("text-sm font-semibold tabular-nums", state === "refunded" ? "text-hw-grey-500 line-through" : "text-hw-grey-900")}>
          {formatNairaAmount(amount)}
        </span>
        <Badge className={cn("h-6 gap-1.5 px-2.5", chip)}>
          <span className={cn("size-1.5 rounded-full", dot)} />
          {label}
        </Badge>
        <Button size="sm" variant="ghost" onClick={onOpen}>
          Details
        </Button>
      </ItemActions>
    </Item>
  )
}

/** What the customer has paid, for which job, and any refund */
const CustomerPayments = () => {
  const { data = [], isPending, isError, refetch } = useMyBookings()
  const [openId, setOpenId] = useState<number | null>(null)
  const payments = bookingPayments(data)
  const totals = summarizePayments(payments)
  const open = data.find(({ id }) => id === openId) ?? null

  return (
    <>
      <PageHeader title="Payments" description="What you've paid, what we're holding for you, and any refunds." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total paid" value={formatNairaAmount(totals.paid)} hint="Not counting refunds" icon={CircleDollarSign} tone="brand" loading={isPending} />
        <StatCard label="Held by us" value={formatNairaAmount(totals.held)} hint="Until you confirm the job" icon={ShieldCheck} tone="info" loading={isPending} />
        <StatCard label="Refunded" value={formatNairaAmount(totals.refunded)} hint="Back to your account" icon={RotateCcw} tone="neutral" loading={isPending} />
      </div>

      <SectionCard title="Payment history">
        <QueryContent
          isPending={isPending}
          isError={isError}
          onRetry={refetch}
          isEmpty={!payments.length}
          empty={
            <EmptyState
              icon={CreditCard}
              title="No payments yet"
              description="You pay once an artisan accepts your request."
              action={
                <Button render={<Link href={ACCOUNT_ROUTES.customerBookings} />} nativeButton={false} variant="outline">
                  My bookings
                </Button>
              }
            />
          }
        >
          <ItemGroup className="gap-3">
            {payments.map((payment) => (
              <PaymentRow key={payment.booking.id} payment={payment} onOpen={() => setOpenId(payment.booking.id)} />
            ))}
          </ItemGroup>
        </QueryContent>
      </SectionCard>

      <BookingDetailsSheet booking={open} viewer="customer" onOpenChange={(next) => !next && setOpenId(null)} />
    </>
  )
}

export default CustomerPayments
