import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { StaffRole } from "@/types/admin/staff"

export const ROLE_INFO: Record<StaffRole, { label: string, description: string }> = {
  ADMIN: { label: "Admin", description: "Everything, including approving payouts, settling reported problems and managing staff." },
  SUPPORT: { label: "Support", description: "Everything except money decisions (payouts, refunds) and managing staff." },
}

export const StaffRoleBadge = ({ role, className }: { role: StaffRole, className?: string }) => (
  <Badge className={cn(role === "ADMIN" ? SEMANTIC_TONES.brand.chip : SEMANTIC_TONES.info.chip, className)}>{ROLE_INFO[role].label}</Badge>
)
