import type { LucideIcon } from "lucide-react"

export interface Step {
  icon: LucideIcon
  title: string
  text: string
}

/** Numbered icon steps, e.g. "how paying works" or onboarding */
const StepList = ({ steps }: { steps: Step[] }) => (
  <ol className="flex flex-col gap-4">
    {steps.map(({ icon: Icon, title, text }, index) => (
      <li key={title} className="flex gap-3">
        <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-hw-secondary">
          <Icon className="size-4" />
          <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-hw-primary text-[10px] font-semibold text-white">
            {index + 1}
          </span>
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-hw-grey-900">{title}</span>
          <span className="text-xs leading-relaxed text-hw-grey-500">{text}</span>
        </span>
      </li>
    ))}
  </ol>
)

export default StepList
