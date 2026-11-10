import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { STAGE_META } from "@/lib/requests"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { RequestStage } from "@/types/account/requests"

const RequestStageBadge = ({ stage, className }: { stage: RequestStage, className?: string }) => {
  const { label, tone } = STAGE_META[stage]
  const { chip, dot } = SEMANTIC_TONES[tone]
  return (
    <Badge className={cn("h-6 gap-1.5 px-2.5", chip, className)}>
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </Badge>
  )
}

export default RequestStageBadge
