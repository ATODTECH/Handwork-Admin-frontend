import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { SEMANTIC_TONES } from "@/lib/tones"
import { WITHDRAWAL_STATUS } from "@/lib/wallet"
import type { WithdrawalStatus } from "@/types/account/wallet"

const WithdrawalStatusBadge = ({ status, className }: { status: WithdrawalStatus, className?: string }) => {
  const { label, tone } = WITHDRAWAL_STATUS[status]
  const { chip, dot } = SEMANTIC_TONES[tone]

  return (
    <Badge className={cn("h-6 gap-1.5 px-2.5", chip, className)}>
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </Badge>
  )
}

export default WithdrawalStatusBadge
