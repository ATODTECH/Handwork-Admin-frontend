import { Check } from "lucide-react"
import { cn } from "cn"
import { BOOKING_STEPS, bookingMeta } from "@/lib/bookings"
import type { BookingStatus } from "@/types/account/dashboard"

/** Step tracker along the booking's happy path */
const BookingProgress = ({ status }: { status: BookingStatus }) => {
  const { step } = bookingMeta(status)
  if (step < 0) return null

  return (
    <ol className="grid grid-cols-6 gap-1" aria-label="Booking progress">
      {BOOKING_STEPS.map((label, index) => {
        // `step` is the last step reached, so the one after it is in progress
        const done = index <= step
        const current = index === step + 1
        return (
          <li key={label} className="flex flex-col gap-2" aria-current={current ? "step" : undefined}>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ring-2 ring-white",
                  done && "bg-hw-primary text-white",
                  current && "bg-hw-primary/15 text-hw-primary ring-hw-primary/30",
                  !done && !current && "bg-hw-grey-200 text-hw-grey-500",
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
              </span>
              {index < BOOKING_STEPS.length - 1 && (
                <span className={cn("h-0.5 flex-1 rounded-full", index < step ? "bg-hw-primary" : "bg-hw-grey-200")} />
              )}
            </div>
            <span className={cn("hidden text-[11px] leading-tight sm:block", current || done ? "font-medium text-hw-grey-900" : "text-hw-grey-500")}>
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default BookingProgress
