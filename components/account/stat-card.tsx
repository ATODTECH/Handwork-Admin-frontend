import type { LucideIcon } from "lucide-react"
import { cn } from "cn"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SEMANTIC_TONES, type SemanticTone } from "@/lib/tones"

interface StatCardProps {
  label: string
  value: React.ReactNode
  hint?: string
  icon: LucideIcon
  tone: SemanticTone
  loading?: boolean
}

const StatCard = ({ label, value, hint, icon: Icon, tone, loading }: StatCardProps) => (
  <Card className="relative gap-3 rounded-2xl p-4 shadow-none ring-hw-border transition-shadow hover:shadow-md sm:gap-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-hw-grey-500 sm:text-sm">{label}</span>
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10", SEMANTIC_TONES[tone].icon)}>
        <Icon className="size-5" />
      </span>
    </div>
    <div className="flex flex-col gap-1">
      {loading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <span className="text-xl font-semibold tracking-tight text-hw-grey-900 tabular-nums sm:text-2xl">{value}</span>
      )}
      {hint && <span className="hidden text-xs text-hw-grey-500 sm:block">{hint}</span>}
    </div>
  </Card>
)

export default StatCard
