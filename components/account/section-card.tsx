import { cn } from "cn"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SectionCardProps {
  title: string
  description?: string
  /** Top-right slot, e.g. a "View all" link */
  action?: React.ReactNode
  className?: string
  contentClassName?: string
  children: React.ReactNode
}

/** A titled dashboard panel */
const SectionCard = ({ title, description, action, className, contentClassName, children }: SectionCardProps) => (
  <Card className={cn("gap-5 rounded-2xl shadow-none ring-hw-border", className)}>
    <CardHeader>
      <CardTitle className="text-base font-semibold text-hw-grey-900">{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
      {action && <CardAction>{action}</CardAction>}
    </CardHeader>
    <CardContent className={contentClassName}>{children}</CardContent>
  </Card>
)

export default SectionCard
