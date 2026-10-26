import type { LucideIcon } from "lucide-react"
import { cn } from "cn"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: React.ReactNode
  /** e.g. a call-to-action button */
  action?: React.ReactNode
  className?: string
}

/** shadcn Empty with the dashboards' icon treatment */
const EmptyState = ({ icon: Icon, title, description, action, className }: EmptyStateProps) => (
  <Empty className={cn("gap-4 border border-dashed border-hw-grey-200 bg-hw-grey-200/15 p-8", className)}>
    <EmptyHeader>
      <EmptyMedia variant="icon" className="size-12 rounded-xl bg-[#FEF1ED] text-hw-primary">
        <Icon />
      </EmptyMedia>
      <EmptyTitle className="text-hw-grey-900">{title}</EmptyTitle>
      {description && <EmptyDescription>{description}</EmptyDescription>}
    </EmptyHeader>
    {action && <EmptyContent>{action}</EmptyContent>}
  </Empty>
)

export default EmptyState
