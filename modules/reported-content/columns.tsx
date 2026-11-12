import { cn } from "cn"
import { createDataTableColumns } from "@/components/table-data/columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import { REPORT_STATUS, TARGET_NOUNS } from "@/lib/reports"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { ReportStatus } from "@/types/account/reports"
import type { ReportForStaff } from "@/types/admin/reports"

const column = createDataTableColumns<ReportForStaff>()

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** One line saying what was reported, as it is now */
export const targetSummary = ({ target, target_type, reported_user }: ReportForStaff) => {
  if (target_type === "USER") return reported_user ? reported_user.name : "Deleted account"
  if (!target) return `${capitalise(TARGET_NOUNS[target_type])} no longer exists`
  switch (target.kind) {
    case "REQUEST":
      return `${target.reference}: ${target.title}`
    case "OFFER":
      return `${formatNairaAmount(target.price)} on “${target.request_title}”`
    case "MESSAGE":
      return target.text
    case "BOOKING":
      return `#${target.id} · ${target.services.join(", ") || "Booking"}`
    case "REVIEW":
      return `${target.star}★ ${target.message || "(no text)"}`
  }
}

export const ReportStatusBadge = ({ status, className }: { status: ReportStatus, className?: string }) => (
  <Badge className={cn(SEMANTIC_TONES[REPORT_STATUS[status].tone].chip, className)}>{REPORT_STATUS[status].label}</Badge>
)

interface ReportTableActions {
  onView: (report: ReportForStaff) => void
  onResolve: (report: ReportForStaff) => void
}

export const reportColumns = ({ onView, onResolve }: ReportTableActions) =>
  column.columns([
    column.display({
      id: "what",
      header: "Reported",
      cell: ({ row: { original } }) => (
        <div className="flex max-w-72 min-w-0 flex-col">
          <span className="text-xs font-medium text-hw-grey-500 uppercase">{TARGET_NOUNS[original.target_type]}</span>
          <span className="truncate text-hw-grey-900">{targetSummary(original)}</span>
        </div>
      ),
    }),
    column.display({
      id: "reason",
      header: "Reason",
      cell: ({ row: { original } }) => (
        <div className="flex max-w-56 flex-col">
          <span className="font-medium text-hw-grey-900">{original.reason_label}</span>
          {original.details && <span className="line-clamp-1 text-xs whitespace-normal text-hw-grey-500">{original.details}</span>}
        </div>
      ),
    }),
    column.display({
      id: "people",
      header: "Reporter → reported",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ row: { original } }) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate">{original.reporter.name}</span>
          <span className="truncate text-xs text-hw-grey-500">
            → {original.reported_user?.name ?? "Unknown"}
            {!!original.reported_user?.reports_received && original.reported_user.reports_received > 1 &&
              ` · reported ${original.reported_user.reports_received}×`}
          </span>
        </div>
      ),
    }),
    column.display({
      id: "when",
      header: "When",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ row: { original } }) => (
        <div className="flex flex-col">
          <span>{formatActivityDate(original.created_at)}</span>
          {original.other_open_reports > 0 && (
            <span className="text-xs text-hw-text-warning">+{original.other_open_reports} more about this</span>
          )}
        </div>
      ),
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue, row: { original } }) => (
        <div className="flex flex-col items-start gap-1">
          <ReportStatusBadge status={getValue()} />
          {original.content_hidden && <span className="text-xs text-hw-grey-500">Removed</span>}
        </div>
      ),
    }),
    column.display({
      id: "actions",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row: { original } }) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(original)}>
            View
          </Button>
          {original.status === "OPEN" && (
            <Button size="sm" onClick={() => onResolve(original)}>
              Settle
            </Button>
          )}
        </div>
      ),
    }),
  ])
