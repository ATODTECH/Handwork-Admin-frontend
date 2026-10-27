import type { LucideIcon } from "lucide-react"
import { Check } from "lucide-react"
import { cn } from "cn"

export type StepStatus = "complete" | "current" | "upcoming"

export interface StepperStep {
  id: string
  icon: LucideIcon
  title: string
  description: string
  status: StepStatus
}

const MARKER_STYLES: Record<StepStatus, string> = {
  complete: "bg-hw-text-green-solid text-white",
  current: "bg-hw-secondary text-white ring-4 ring-secondary",
  upcoming: "bg-muted text-hw-grey-500",
}

const STATUS_LABEL: Record<StepStatus, string> = {
  complete: "Done",
  current: "In progress",
  upcoming: "Not started",
}

/** Vertical progress through a multi-step flow, e.g. onboarding */
const Stepper = ({ steps, className }: { steps: StepperStep[], className?: string }) => (
  <ol className={cn("flex flex-col", className)}>
    {steps.map(({ id, icon: Icon, title, description, status }, index) => {
      const isLast = index === steps.length - 1
      return (
        <li key={id} className="relative flex gap-3 pb-6 last:pb-0" aria-current={status === "current" ? "step" : undefined}>
          {!isLast && (
            <span
              aria-hidden
              className={cn("absolute top-10 bottom-1 left-[17px] w-0.5 rounded-full", status === "complete" ? "bg-hw-text-green-solid/40" : "bg-hw-border")}
            />
          )}
          <span className={cn("relative flex size-9 shrink-0 items-center justify-center rounded-full transition-colors", MARKER_STYLES[status])}>
            {status === "complete" ? <Check className="size-4" /> : <Icon className="size-4" />}
          </span>
          <span className="flex min-w-0 flex-col gap-0.5 pt-0.5">
            <span className="text-xs font-medium tracking-wide text-hw-grey-500 uppercase">
              Step {index + 1} · {STATUS_LABEL[status]}
            </span>
            <span className={cn("text-sm font-medium", status === "upcoming" ? "text-hw-grey-500" : "text-hw-grey-900")}>{title}</span>
            <span className="text-xs leading-relaxed text-hw-grey-500">{description}</span>
          </span>
        </li>
      )
    })}
  </ol>
)

export default Stepper
