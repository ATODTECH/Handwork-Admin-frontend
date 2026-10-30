"use client"

import { useRef } from "react"
import { Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FieldFrame, { fieldErrorId, isFieldInvalid, type FieldFrameProps } from "./field-frame"

interface TimeFieldProps extends Omit<FieldFrameProps, "className"> {
  /** HH:MM (24-hour), or "" when nothing is picked */
  value: string
  onValueChange: (value: string) => void
  /** Called when the list closes, so the form can mark the field touched */
  onTouch?: () => void
  placeholder?: string
  /** First and last hour offered, 24-hour */
  fromHour?: number
  toHour?: number
  stepMinutes?: number
  disabled?: boolean
}

const pad = (n: number) => String(n).padStart(2, "0")

const timeLabel = (hour: number, minute: number) => `${hour % 12 || 12}:${pad(minute)} ${hour < 12 ? "AM" : "PM"}`

/** Every slot from `fromHour` to `toHour`, as { value: "HH:MM", label: "9:30 AM" } */
const timeSlots = (fromHour: number, toHour: number, stepMinutes: number) => {
  const slots = []
  for (let minutes = fromHour * 60; minutes <= toHour * 60; minutes += stepMinutes) {
    const hour = Math.floor(minutes / 60)
    slots.push({ value: `${pad(hour)}:${pad(minutes % 60)}`, label: timeLabel(hour, minutes % 60) })
  }
  return slots
}

/** Time picker on shadcn Select, offering slots in working hours instead of a free-typed time */
const TimeField = ({
  name,
  label,
  description,
  error,
  touched,
  value,
  onValueChange,
  onTouch,
  placeholder = "Pick a time",
  fromHour = 6,
  toHour = 21,
  stepMinutes = 30,
  disabled,
}: TimeFieldProps) => {
  const showError = isFieldInvalid({ error, touched })
  const slots = timeSlots(fromHour, toHour, stepMinutes)
  // Touching validates the value from before a pick, so only closing without one counts
  const picked = useRef(false)

  return (
    <FieldFrame name={name} label={label} description={description} error={error} touched={touched}>
      <Select
        items={slots}
        value={value || null}
        onValueChange={(next) => {
          picked.current = true
          onValueChange((next as string | null) ?? "")
        }}
        onOpenChange={(open) => {
          if (open) picked.current = false
          else if (!picked.current) onTouch?.()
        }}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          aria-invalid={showError}
          aria-describedby={showError ? fieldErrorId(name) : undefined}
          className="h-11! w-full px-3"
        >
          <Clock className="size-4 text-hw-grey-500" />
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} className="max-h-64">
          {slots.map((slot) => (
            <SelectItem key={slot.value} value={slot.value}>
              {slot.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldFrame>
  )
}

export default TimeField
