"use client"

import { cn } from "cn"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Filter } from "lucide-react"

// Radix Select cannot hold an empty value, so "no filter" travels as this.
const ALL = "All Roles"

export interface FilterOption<T extends string> {
  readonly label: string
  /** Undefined means "no filter"; put that option first. */
  readonly value?: T
}

interface FilterSelectProps<T extends string> {
  label: string
  options: readonly FilterOption<T>[]
  value: T | undefined
  onChange: (value: T | undefined) => void
  filter?: string
  className?: string
}

/** A toolbar filter. Highlighted while it narrows the results. */
export const FilterSelect = <T extends string> ({ label, options, value, onChange, filter, className }: FilterSelectProps<T>) => {
  const isActive = value !== undefined

  return (
    <Select value={value ?? ALL} onValueChange={(next) => onChange(next === ALL ? undefined : (next as T))}>
      <SelectTrigger
        aria-label={label}
        render={
          <button>
            {filter ? 
              <>
                {filter}
                <Filter className=" text-hw-grey-500" />
              </> :
              <>
                <SelectValue />
                <ChevronDown />
              </>
            }
          </button>
        }
        className={cn(
          "h-9 min-w-36 rounded-lg bg-hw-base-white px-3 text-[13px] tracking-wide font-medium",
          isActive ? `border-violet-300 bg-violet-50 text-primary ${filter?'[&_svg]:text-primary':'[&_svg]:text-violet-400'}` : "border-primary-border text-[#98A2B3] hover:bg-slate-50",
          className,
        )}
      />
      {/* {filter ?? <SelectValue />} */}
      <SelectContent align="start">
        {options.map((option) => (
          <SelectItem key={option.value ?? ALL} value={option.value ?? ALL}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
