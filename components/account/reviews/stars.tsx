"use client"

import { useState } from "react"
import { cn } from "cn"
import { Star } from "lucide-react"
import { STAR_LABELS } from "@/lib/reviews"

const FILLED = "fill-[#F3A218] text-[#F3A218]"
const EMPTY = "text-hw-grey-300"

/** A rating shown as five stars (rounded to the nearest whole star) */
export const Stars = ({ value, className }: { value: number, className?: string }) => (
  <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star key={star} className={cn("size-3.5", star <= Math.round(value) ? FILLED : EMPTY)} aria-hidden />
    ))}
  </span>
)

interface StarInputProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  invalid?: boolean
}

/** Pick 1 to 5 stars; arrow keys work as a radio group */
export const StarInput = ({ value, onChange, disabled, invalid }: StarInputProps) => {
  const [hovered, setHovered] = useState(0)
  const shown = hovered || value

  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label="Your rating" aria-invalid={invalid} className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} ${star === 1 ? "star" : "stars"}: ${STAR_LABELS[star]}`}
            tabIndex={value === star || (!value && star === 1) ? 0 : -1}
            disabled={disabled}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star)}
            onKeyDown={(event) => {
              const next = event.key === "ArrowRight" || event.key === "ArrowUp" ? star + 1 : event.key === "ArrowLeft" || event.key === "ArrowDown" ? star - 1 : 0
              if (next < 1 || next > 5) return
              event.preventDefault()
              onChange(next)
              ;(event.currentTarget.parentElement?.children[next - 1] as HTMLElement | undefined)?.focus()
            }}
            className="rounded-md p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <Star className={cn("size-8 transition-colors", star <= shown ? FILLED : EMPTY)} aria-hidden />
          </button>
        ))}
      </div>
      <span className="text-sm font-medium text-hw-grey-700" aria-live="polite">{STAR_LABELS[shown]}</span>
    </div>
  )
}
