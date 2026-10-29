import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { bookingMeta, jobMeta } from "@/lib/bookings"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { BookingStatus } from "@/types/account/dashboard"

export type BookingViewer = "customer" | "artisan"

interface BookingStatusBadgeProps {
  status: BookingStatus
  /** Customers and artisans see different labels for the same status */
  viewer?: BookingViewer
  className?: string
}

const BookingStatusBadge = ({ status, viewer = "customer", className }: BookingStatusBadgeProps) => {
  const { label, tone } = viewer === "artisan" ? jobMeta(status) : bookingMeta(status)
  const { chip, dot } = SEMANTIC_TONES[tone]

  return (
    <Badge className={cn("h-6 gap-1.5 px-2.5", chip, className)}>
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </Badge>
  )
}

export default BookingStatusBadge
