"use client"

import { cn } from "cn"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCount } from "@/lib/format"

export interface FilterTab<T extends string> {
  readonly label: string
  readonly value: T
  readonly count?: number
}

interface FilterTabsProps<T extends string> {
  label: string
  tabs: readonly FilterTab<T>[]
  value: T
  onChange: (value: T) => void
  /** `segmented` is the grey pill bar; `pill` is separate outlined chips with counts. */
  variant?: "segmented" | "pill"
  className?: string
}

/** Switches which slice of a list is shown. The list itself sits outside. */
export function FilterTabs<T extends string>({ label, tabs, value, onChange, variant = "segmented", className }: FilterTabsProps<T>) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as T)} className={className}>
      <TabsList
        aria-label={label}
        className={cn(
          // Scoped like shadcn's own h-8, or that more specific rule wins and the tabs overflow the track.
          "h-auto group-data-horizontal/tabs:h-auto flex-wrap",
          variant === "segmented" ? "gap-1 rounded-lg bg-[#F4F3F5] p-1" : "gap-3 bg-transparent p-0",
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "h-auto flex-none cursor-pointer",
              variant === "segmented"
                ? "rounded-md px-3.5 py-1.5 text-[13px] font-medium text-neutral-light-400 data-active:font-semibold data-active:text-neutral-light-600"
                : "gap-2 rounded-lg border border-primary-border bg-neutral-white px-3 py-2 text-sm font-semibold text-neutral-light-400 hover:bg-slate-50 data-active:border-violet-300 data-active:bg-violet-50 data-active:text-primary",
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                  tab.value === value ? "rounded-sm bg-primary text-primary-foreground" : "bg-[#F4F3F5] text-neutral-light-300",
                )}
              >
                {formatCount(tab.count)}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
