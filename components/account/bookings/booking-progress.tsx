import { Check } from "lucide-react"
import { cn } from "cn"
import { BOOKING_STEPS, bookingMeta } from "@/lib/bookings"
import type { BookingStatus } from "@/types/account/dashboard"

/** Step tracker along the booking's happy path */
const BookingProgress = ({ status }: { status: BookingStatus }) => {
  const { step } = bookingMeta(status)
  if (step < 0) return null

  // The step being worked on, or the last one once they're all done
  const shownStep = Math.min(step + 1, BOOKING_STEPS.length - 1)

  return (
    <div className="@container flex flex-col gap-2">
      <ol className="flex" aria-label="Booking progress">
        {BOOKING_STEPS.map((label, index) => {
          // `step` is the last step reached, so the one after it is in progress
          const done = index <= step
          const current = index === step + 1
          return (
            <li key={label} className="relative flex min-w-0 flex-1 flex-col items-center gap-2 text-center" aria-current={current ? "step" : undefined}>
              {/* Joins this circle's centre to the next one's, behind both circles */}
              {index < BOOKING_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn("absolute top-3 left-1/2 h-0.5 w-full -translate-y-1/2", index < step ? "bg-hw-primary" : "bg-hw-grey-200")}
                />
              )}
              <span
                className={cn(
                  "relative flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ring-4 ring-white",
                  done && "bg-hw-primary text-white",
                  current && "bg-[color-mix(in_oklab,var(--color-hw-primary)_15%,white)] text-hw-primary outline-2 outline-hw-primary/40",
                  !done && !current && "bg-hw-grey-200 text-hw-grey-500",
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
              </span>
              <span className={cn("hidden px-0.5 text-[11px] leading-tight @md:block", current || done ? "font-medium text-hw-grey-900" : "text-hw-grey-500")}>
                {label}
              </span>
            </li>
          )
        })}
      </ol>
      {/* Too narrow for six labels side by side, so name just the step they're on */}
      <p className="text-xs text-hw-grey-500 @md:hidden">
        Step {shownStep + 1} of {BOOKING_STEPS.length} · <span className="font-medium text-hw-grey-900">{BOOKING_STEPS[shownStep]}</span>
      </p>
    </div>
  )
}

export default BookingProgress
