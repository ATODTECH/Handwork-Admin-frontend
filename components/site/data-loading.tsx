import { LoaderCircle } from "lucide-react"

export const DataLoading = ({ className = "mt-50" }: { className?: string }) => (
  <div className={`flex justify-center ${className}`} role="status" aria-label="Loading">
    <LoaderCircle className="h-7.5 w-7.5 animate-spin text-secondary-blue" />
  </div>
)
