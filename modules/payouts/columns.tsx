import { Button } from "@/components/ui/button"
import WithdrawalStatusBadge from "@/components/shared/withdrawal-status-badge"
import { createDataTableColumns } from "@/components/table-data/columns"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import type { WithdrawalForReview } from "@/types/admin/withdrawals"

const column = createDataTableColumns<WithdrawalForReview>()

interface PayoutActions {
  onApprove: (withdrawal: WithdrawalForReview) => void
  onReject: (withdrawal: WithdrawalForReview) => void
}

export const payoutColumns = ({ onApprove, onReject }: PayoutActions) =>
  column.columns([
    column.display({
      id: "artisan",
      header: "Artisan",
      cell: ({ row: { original } }) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-hw-grey-900">{original.artisan.name}</span>
          <span className="truncate text-xs text-hw-grey-500">{original.artisan.email}</span>
        </div>
      ),
    }),
    column.accessor("amount", {
      header: "Amount",
      meta: { cellClassName: "font-semibold text-hw-grey-900 tabular-nums" },
      cell: ({ getValue }) => formatNairaAmount(getValue()),
    }),
    column.display({
      id: "account",
      header: "Bank account",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ row: { original } }) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate">{original.account_name}</span>
          <span className="truncate text-xs text-hw-grey-500">
            {original.bank_name} · {original.account_number}
          </span>
        </div>
      ),
    }),
    column.accessor("created_at", {
      header: "Requested",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ getValue }) => <time dateTime={getValue()}>{formatActivityDate(getValue())}</time>,
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue, row: { original } }) => (
        <div className="flex max-w-56 flex-col items-start gap-1">
          <WithdrawalStatusBadge status={getValue()} />
          {original.note && <span className="text-xs text-hw-grey-500">{original.note}</span>}
          {original.reviewed_by && getValue() !== "PENDING" && (
            <span className="text-xs text-hw-grey-500">by {original.reviewed_by}</span>
          )}
        </div>
      ),
    }),
    column.display({
      id: "actions",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row: { original } }) =>
        original.status === "PENDING" && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onReject(original)}>
              Reject
            </Button>
            <Button size="sm" onClick={() => onApprove(original)}>
              Approve
            </Button>
          </div>
        ),
    }),
  ])
