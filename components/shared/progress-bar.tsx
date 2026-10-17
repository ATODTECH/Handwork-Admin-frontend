import { cn } from "cn"

/** Indeterminate bar in the brand gradient, for work with no known length. */
function ProgressBar({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative h-0.5 w-full overflow-hidden bg-brand-surface", className)}>
      <div className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-brand-gradient animate-progress motion-reduce:animate-none motion-reduce:w-full" />
    </div>
  )
}

export { ProgressBar }
