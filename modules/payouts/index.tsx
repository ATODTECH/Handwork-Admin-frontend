"use client"

import { useMemo, useState } from "react"
import ReasonDialog from "@/components/shared/reason-dialog"
import { FilterTabs, type FilterTab } from "@/components/shared/filter-tabs"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/table-data/data-table"
import { DataTablePagination } from "@/components/table-data/data-table-pagination"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import { useRejectWithdrawal, useWithdrawalCounts, useWithdrawals } from "@/hooks/admin/use-withdrawals"
import { formatNairaAmount } from "@/lib/format"
import type { WithdrawalFilter, WithdrawalForReview } from "@/types/admin/withdrawals"
import ApproveDialog from "./approve-dialog"
import { payoutColumns } from "./columns"

const PAGE_SIZE = 10

const TABS: { value: WithdrawalFilter, label: string }[] = [
  { value: "pending", label: "Waiting for approval" },
  { value: "processing", label: "Sending" },
  { value: "paid", label: "Sent" },
  { value: "unsuccessful", label: "Failed or rejected" },
]

const EMPTY: Record<WithdrawalFilter, string> = {
  pending: "No withdrawals are waiting for approval.",
  processing: "Nothing is being sent right now.",
  paid: "No withdrawals have been sent yet.",
  unsuccessful: "No failed or rejected withdrawals.",
}

const QUICK_REASONS = [
  "The account name doesn't match the artisan's ID.",
  "There's an open complaint about one of this artisan's jobs.",
  "Please contact support before we send this.",
]

/** Staff approve artisans' withdrawals; approving sends the money through Paystack */
const PayoutsIndex = () => {
  const heading = usePageHeading()
  const [status, setStatus] = useState<WithdrawalFilter>("pending")
  const [page, setPage] = useState(1)
  const [approving, setApproving] = useState<WithdrawalForReview | null>(null)
  const [rejecting, setRejecting] = useState<WithdrawalForReview | null>(null)
  const reject = useRejectWithdrawal()

  const list = useWithdrawals(status)
  const counts = useWithdrawalCounts()
  const withdrawals = list.data ?? []
  const columns = useMemo(() => payoutColumns({ onApprove: setApproving, onReject: setRejecting }), [])
  const tabs: FilterTab<WithdrawalFilter>[] = TABS.map((tab) => ({ ...tab, count: counts.data?.[tab.value] }))

  const lastPage = Math.max(1, Math.ceil(withdrawals.length / PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)
  const pageRows = withdrawals.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const changeStatus = (next: WithdrawalFilter) => {
    setStatus(next)
    setPage(1)
  }

  return (
    <section className="flex flex-1 flex-col gap-5 overflow-y-auto py-7.5 pr-8 scrollbar-thin">
      <PageHeader
        title={heading?.title ?? "Payouts"}
        description={heading?.description ?? "Approve artisans' withdrawals."}
        action={null}
      />

      <FilterTabs label="Withdrawal status" tabs={tabs} value={status} onChange={changeStatus} className="w-fit" />

      <DataTable
        label="Withdrawals"
        columns={columns}
        data={pageRows}
        getRowId={(row) => String(row.id)}
        isLoading={list.isPending}
        isRefreshing={list.isFetching && !list.isPending}
        error={list.error}
        onRetry={() => list.refetch()}
        isRetrying={list.isRefetching}
        skeletonRows={5}
        emptyMessage={EMPTY[status]}
        className="rounded-xl bg-hw-base-white"
        footer={
          withdrawals.length > PAGE_SIZE && (
            <DataTablePagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={withdrawals.length}
              onPageChange={setPage}
              noun={{ one: "withdrawal", other: "withdrawals" }}
            />
          )
        }
      />

      <ApproveDialog withdrawal={approving} onOpenChange={(open) => !open && setApproving(null)} />
      <ReasonDialog
        open={rejecting !== null}
        onOpenChange={(open) => !open && setRejecting(null)}
        title={`Reject ${rejecting ? formatNairaAmount(rejecting.amount) : ""} for ${rejecting?.artisan.name ?? ""}`}
        description="The money goes back to their balance. We'll send them this reason in the app."
        quickReasons={QUICK_REASONS}
        placeholder="e.g. The account name doesn't match your ID. Please update your bank details."
        submitLabel="Reject withdrawal"
        pending={reject.isPending}
        onSubmit={(reason, done) =>
          rejecting &&
          reject.mutate({ id: rejecting.id, reason }, {
            onSuccess: () => {
              done()
              setRejecting(null)
            },
          })
        }
      />
    </section>
  )
}

export default PayoutsIndex
