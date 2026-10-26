import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { bookingMeta } from "@/lib/bookings"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { BookingStatus } from "@/types/account/dashboard"

const BookingStatusBadge = ({ status, className }: { status: BookingStatus, className?: string }) => {
  const { label, tone } = bookingMeta(status)
  const { chip, dot } = SEMANTIC_TONES[tone]

  return (
    <Badge className={cn("h-6 gap-1.5 px-2.5", chip, className)}>
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </Badge>
  )
}

export default BookingStatusBadge
