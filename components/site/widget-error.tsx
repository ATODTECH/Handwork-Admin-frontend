import { RotateCw, TriangleAlert } from "lucide-react"

interface WidgetErrorProps {
  message: string
  onRetry: () => void
  isRetrying?: boolean
}

/** One widget failing leaves the rest of the page usable, with a retry in place. */
export const WidgetError = ({ message, onRetry, isRetrying = false }: WidgetErrorProps) => (
  <div role="alert" className="flex flex-col items-center justify-center gap-3 py-10 text-center">
    <TriangleAlert className="h-5 w-5 text-danger" aria-hidden />
    <p className="max-w-xs text-sm text-ink-muted">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      disabled={isRetrying}
      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-border bg-primary-white px-3 py-1.5 text-xs font-semibold text-secondary-blue outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-secondary-blue/40 disabled:opacity-60"
    >
      <RotateCw className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} aria-hidden />
      {isRetrying ? "Retrying" : "Try again"}
    </button>
  </div>
)
