import { RotateCw, TriangleAlert } from "lucide-react"
import { cn } from "cn"

interface WidgetErrorProps {
  message: string
  onRetry: () => void
  isRetrying?: boolean
  className?: string
}

/** One widget failing leaves the rest of the page usable, with a retry in place. */
export const WidgetError = ({ message, onRetry, isRetrying = false, className }: WidgetErrorProps) => (
  <div role="alert" className={cn("flex flex-col items-center justify-center gap-3 text-center", className)}>
    <TriangleAlert className="h-5 w-5 text-danger" aria-hidden />
    <p className="max-w-xs text-sm text-ink-muted">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      disabled={isRetrying}
      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-border bg-neutral-white px-3 py-1.5 text-xs font-semibold text-brand outline-none hover:bg-brand-surface-subtle focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60"
    >
      <RotateCw className={cn("h-3.5 w-3.5", isRetrying && "animate-spin")} aria-hidden />
      {isRetrying ? "Retrying" : "Try again"}
    </button>
  </div>
)

export const WidgetEmpty = ({ message, className }: { message: string, className?: string }) => (
  <p className={cn("flex items-center justify-center text-center text-sm text-ink-meta", className)}>{message}</p>
)
