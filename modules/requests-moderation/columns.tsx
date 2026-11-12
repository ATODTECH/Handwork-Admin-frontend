import { cn } from "cn"
import { Flag, Lock } from "lucide-react"
import { createDataTableColumns } from "@/components/table-data/columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import { formatLocation } from "@/lib/locations"
import { budgetLabel, STAGE_META } from "@/lib/requests"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { RequestStage } from "@/types/account/requests"
import type { RequestForStaff } from "@/types/admin/requests"

const column = createDataTableColumns<RequestForStaff>()

/** The customer-facing labels speak to the customer ("Pay to confirm"); staff get neutral ones */
const STAFF_STAGE_LABELS: Partial<Record<RequestStage, string>> = {
  PUBLISHED: "No offers yet",
  AWAITING_PAYMENT: "Awaiting payment",
  IN_PROGRESS: "Booked",
  AWAITING_APPROVAL: "Awaiting customer confirmation",
  CLOSED: "Closed",
}

export const StaffStageBadge = ({ stage, className }: { stage: RequestStage, className?: string }) => {
  const { label, tone } = STAGE_META[stage]
  const { chip, dot } = SEMANTIC_TONES[tone]
  return (
    <Badge className={cn("h-6 gap-1.5 px-2.5", chip, className)}>
      <span className={cn("size-1.5 rounded-full", dot)} />
      {STAFF_STAGE_LABELS[stage] ?? label}
    </Badge>
  )
}

export const ReportsBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <Badge className={SEMANTIC_TONES.danger.chip}>
      <Flag />
      {count} open {count === 1 ? "report" : "reports"}
    </Badge>
  ) : null

export const requestColumns = ({ onView }: { onView: (request: RequestForStaff) => void }) =>
  column.columns([
    column.display({
      id: "request",
      header: "Request",
      cell: ({ row: { original } }) => (
        <div className="flex max-w-80 min-w-0 flex-col">
          <span className="flex items-center gap-1.5 truncate font-medium text-hw-grey-900">
            {original.visibility === "PRIVATE" && <Lock className="size-3.5 shrink-0 text-hw-grey-500" aria-label="Private" />}
            <span className="truncate">{original.title}</span>
          </span>
          <span className="truncate text-xs text-hw-grey-500">
            {original.reference} · {original.services.join(", ") || original.category || "No service"}
          </span>
        </div>
      ),
    }),
    column.display({
      id: "customer",
      header: "Customer",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ row: { original } }) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate">{original.customer.name}</span>
          <span className="truncate text-xs text-hw-grey-500">{formatLocation(original) ?? "No location"}</span>
        </div>
      ),
    }),
    column.display({
      id: "budget",
      header: "Budget",
      meta: { cellClassName: "text-hw-grey-700 tabular-nums" },
      cell: ({ row: { original } }) => budgetLabel(original, formatNairaAmount),
    }),
    column.display({
      id: "offers",
      header: "Offers",
      meta: { cellClassName: "tabular-nums" },
      cell: ({ row: { original } }) => (
        <div className="flex flex-col items-start gap-1">
          <span className="text-hw-grey-900">{original.offer_count}</span>
          <ReportsBadge count={original.open_reports} />
        </div>
      ),
    }),
    column.display({
      id: "stage",
      header: "Stage",
      cell: ({ row: { original } }) => (
        <div className="flex flex-col items-start gap-1">
          <StaffStageBadge stage={original.stage} />
          <span className="text-xs text-hw-grey-500">
            {original.published_at ? `Posted ${formatActivityDate(original.published_at)}` : `Started ${formatActivityDate(original.created_at)}`}
          </span>
        </div>
      ),
    }),
    column.display({
      id: "actions",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row: { original } }) => (
        <Button variant="outline" size="sm" onClick={() => onView(original)}>
          View
        </Button>
      ),
    }),
  ])
