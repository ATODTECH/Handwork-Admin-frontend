"use client"

import { useState } from "react"
import { format, parseISO, startOfToday } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import FieldFrame, { fieldErrorId, isFieldInvalid, type FieldFrameProps } from "./field-frame"

interface DateFieldProps extends Omit<FieldFrameProps, "className"> {
  /** YYYY-MM-DD, or "" when nothing is picked */
  value: string
  onValueChange: (value: string) => void
  /** Called when the calendar closes, so the form can mark the field touched */
  onTouch?: () => void
  placeholder?: string
  /** Stop days before today being picked */
  disablePast?: boolean
  disabled?: boolean
}

/** Date picker on shadcn Calendar + Popover; the value stays a YYYY-MM-DD string like a date input's. */
const DateField = ({ name, label, description, error, touched, value, onValueChange, onTouch, placeholder = "Pick a date", disablePast, disabled }: DateFieldProps) => {
  const [open, setOpen] = useState(false)
  const showError = isFieldInvalid({ error, touched })
  const selected = value ? parseISO(value) : undefined

  const changeOpen = (next: boolean) => {
    setOpen(next)
    if (!next) onTouch?.()
  }

  return (
    <FieldFrame name={name} label={label} description={description} error={error} touched={touched}>
      <Popover open={open} onOpenChange={changeOpen}>
        <PopoverTrigger
          render={
            <Button
              id={name}
              type="button"
              variant="outline"
              disabled={disabled}
              aria-invalid={showError}
              aria-describedby={showError ? fieldErrorId(name) : undefined}
              className={cn("h-11 w-full justify-start gap-2 px-3 font-normal", !selected && "text-muted-foreground")}
            />
          }
        >
          <CalendarIcon className="size-4 text-hw-grey-500" />
          {selected ? format(selected, "EEE, d MMM yyyy") : placeholder}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            disabled={disablePast ? { before: startOfToday() } : undefined}
            onSelect={(date) => {
              onValueChange(date ? format(date, "yyyy-MM-dd") : "")
              // Not changeOpen: touching validates the value from before this pick
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </FieldFrame>
  )
}

export default DateField
