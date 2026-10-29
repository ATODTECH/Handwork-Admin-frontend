"use client"

import { useState } from "react"
import { CalendarDays, ChevronRight, MapPin, UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { bookingPrice, bookingTitle, priceAboveBudget } from "@/lib/bookings"
import { formatNairaAmount, formatSchedule, initials } from "@/lib/format"
import type { Booking } from "@/types/account/dashboard"
import BookingStatusBadge, { type BookingViewer } from "./booking-status-badge"
import JobActions from "./job-actions"
import BookingActions from "./booking-actions"
import BookingDetailsSheet from "./booking-details-sheet"

interface BookingViewProps {
  booking: Booking
  /** Customers see the artisan and payment buttons; artisans see the customer and job actions */
  viewer?: BookingViewer
}

/** The other person on the booking */
const counterpart = (booking: Booking, viewer: BookingViewer) => (viewer === "artisan" ? booking.client : booking.artisan)

/** Who / when / where line shared by booking rows and the featured booking card */
export const BookingFacts = ({ booking, viewer = "customer" }: BookingViewProps) => (
  <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-hw-grey-500">
    <span className="inline-flex items-center gap-1.5">
      <UserRound className="size-3.5" />
      {counterpart(booking, viewer)}
    </span>
    <span className="inline-flex items-center gap-1.5">
      <CalendarDays className="size-3.5" />
      {formatSchedule(booking.scheduled_date, booking.scheduled_time)}
    </span>
    {booking.address && (
      <span className="inline-flex min-w-0 items-center gap-1.5">
        <MapPin className="size-3.5 shrink-0" />
        <span className="truncate">{booking.address}</span>
      </span>
    )}
  </span>
)

const BookingRow = ({ booking, viewer = "customer", onOpen }: BookingViewProps & { onOpen: () => void }) => (
  <Item variant="outline" className="rounded-xl bg-white hover:border-hw-grey-300">
    <ItemMedia>
      <Avatar className="size-11 rounded-xl after:rounded-xl">
        <AvatarFallback className="rounded-xl bg-secondary text-sm font-semibold text-hw-secondary">
          {initials(counterpart(booking, viewer))}
        </AvatarFallback>
      </Avatar>
    </ItemMedia>
    <ItemContent className="min-w-0 gap-1.5">
      <ItemTitle className="text-sm font-semibold text-hw-grey-900">{bookingTitle(booking)}</ItemTitle>
      <ItemDescription>
        <BookingFacts booking={booking} viewer={viewer} />
      </ItemDescription>
      {booking.description && <p className="line-clamp-1 text-xs text-hw-grey-700">{booking.description}</p>}
    </ItemContent>
    <ItemActions className="w-full flex-wrap justify-between gap-3 sm:w-auto sm:flex-col sm:items-end sm:justify-center">
      <div className="flex items-center gap-3">
        <span className="flex flex-col items-end">
          <span className="text-sm font-semibold text-hw-grey-900 tabular-nums">{formatNairaAmount(bookingPrice(booking))}</span>
          {priceAboveBudget(booking) > 0 && (
            <span className="text-[11px] text-hw-grey-500 tabular-nums">Budget {formatNairaAmount(booking.budget)}</span>
          )}
        </span>
        <BookingStatusBadge status={booking.status} viewer={viewer} />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onOpen}>
          Details
          <ChevronRight data-icon="inline-end" />
        </Button>
        {viewer === "artisan" ? <JobActions booking={booking} /> : <BookingActions booking={booking} />}
      </div>
    </ItemActions>
  </Item>
)

const BookingList = ({ bookings, viewer = "customer" }: { bookings: Booking[], viewer?: BookingViewer }) => {
  const [openId, setOpenId] = useState<number | null>(null)
  // Looked up by id, so the sheet shows the booking as it changes (e.g. after paying or accepting)
  const open = bookings.find(({ id }) => id === openId) ?? null

  return (
    <>
      <ItemGroup className="gap-3">
        {bookings.map((booking) => (
          <BookingRow key={booking.id} booking={booking} viewer={viewer} onOpen={() => setOpenId(booking.id)} />
        ))}
      </ItemGroup>
      <BookingDetailsSheet booking={open} viewer={viewer} onOpenChange={(next) => !next && setOpenId(null)} />
    </>
  )
}

export default BookingList
