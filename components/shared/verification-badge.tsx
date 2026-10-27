import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { VERIFICATION_STATUS } from "@/lib/artisans"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { VerificationStatus } from "@/types/admin/artisans"

/** An artisan's review status, in the same colours in the admin console and the artisan dashboard */
const VerificationBadge = ({ status, className }: { status: VerificationStatus, className?: string }) => {
  const { label, tone } = VERIFICATION_STATUS[status]
  return (
    <Badge variant="outline" className={cn("border-0 font-medium", SEMANTIC_TONES[tone].chip, className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", SEMANTIC_TONES[tone].dot)} />
      {label}
    </Badge>
  )
}

export default VerificationBadge
