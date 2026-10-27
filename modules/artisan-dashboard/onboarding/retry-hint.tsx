import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Inline "couldn't load, try again" note under a field whose options failed to load */
const RetryHint = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
  <span className="flex flex-wrap items-center gap-x-2 text-destructive">
    {message}
    <Button type="button" variant="link" size="sm" className="h-auto px-0" onClick={onRetry}>
      <RefreshCw data-icon="inline-start" />
      Try again
    </Button>
  </span>
)

export default RetryHint
