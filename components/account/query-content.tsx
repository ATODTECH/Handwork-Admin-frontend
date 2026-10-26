import { RefreshCw, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import EmptyState from "./empty-state"

/** Placeholder rows while a list loads */
export const ListSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-lg border border-hw-border p-3.5">
        <Skeleton className="size-10 shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3.5 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    ))}
  </div>
)

interface QueryContentProps {
  isPending: boolean
  isError: boolean
  onRetry: () => void
  isEmpty: boolean
  /** Rendered when the data loaded but there's nothing to show */
  empty: React.ReactNode
  skeleton?: React.ReactNode
  children: React.ReactNode
}

/** The loading / error / empty / data switch every dashboard list goes through */
const QueryContent = ({ isPending, isError, onRetry, isEmpty, empty, skeleton, children }: QueryContentProps) => {
  if (isPending) return skeleton ?? <ListSkeleton />
  if (isError) {
    return (
      <EmptyState
        icon={WifiOff}
        title="Couldn't load this"
        description="Check your connection and try again."
        action={
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw />
            Try again
          </Button>
        }
      />
    )
  }
  return isEmpty ? empty : children
}

export default QueryContent
