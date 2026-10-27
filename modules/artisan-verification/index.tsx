"use client"

import { useMemo, useState } from "react"
import { FilterTabs, type FilterTab } from "@/components/shared/filter-tabs"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/table-data/data-table"
import { DataTablePagination } from "@/components/table-data/data-table-pagination"
import { useArtisanReviewCounts, useArtisansForReview } from "@/hooks/admin/use-artisan-review"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import type { ArtisanForReview, ArtisanReviewFilter } from "@/types/admin/artisans"
import { artisanColumns, fullName } from "./columns"
import RejectDialog from "./reject-dialog"
import ReviewSheet from "./review-sheet"

const PAGE_SIZE = 10

const TABS: { value: ArtisanReviewFilter, label: string }[] = [
  { value: "pending", label: "Awaiting review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Changes requested" },
  { value: "incomplete", label: "Still onboarding" },
]

const EMPTY: Record<ArtisanReviewFilter, string> = {
  pending: "No artisans are waiting for review.",
  approved: "No approved artisans yet.",
  rejected: "No artisans have been asked for changes.",
  incomplete: "Every artisan has finished onboarding.",
}

/** Staff review queue: approve artisans so customers can find and book them */
const ArtisanVerificationIndex = () => {
  const heading = usePageHeading()
  const [status, setStatus] = useState<ArtisanReviewFilter>("pending")
  const [page, setPage] = useState(1)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<{ id: string, name: string } | null>(null)

  const list = useArtisansForReview(status)
  const counts = useArtisanReviewCounts()
  const artisans = list.data ?? []
  // Read from the live list, so a decision (which moves the artisan to another tab) closes the sheet
  const reviewing = artisans.find(({ id }) => id === reviewingId) ?? null
  const columns = useMemo(() => artisanColumns(({ id }) => setReviewingId(id)), [])
  const tabs: FilterTab<ArtisanReviewFilter>[] = TABS.map((tab) => ({ ...tab, count: counts.data?.[tab.value] }))

  const lastPage = Math.max(1, Math.ceil(artisans.length / PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)
  const pageRows = artisans.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const changeStatus = (next: ArtisanReviewFilter) => {
    setStatus(next)
    setPage(1)
  }

  const requestChanges = (artisan: ArtisanForReview) => {
    setReviewingId(null)
    setRejecting({ id: artisan.id, name: fullName(artisan) })
  }

  return (
    <section className="flex flex-1 flex-col gap-5 overflow-y-auto py-7.5 pr-8 scrollbar-thin">
      <PageHeader
        title={heading?.title ?? "Artisans"}
        description={heading?.description ?? "Review new artisans before customers can find and book them."}
        action={null}
      />

      <FilterTabs label="Artisan status" tabs={tabs} value={status} onChange={changeStatus} className="w-fit" />

      <DataTable
        label="Artisans"
        columns={columns}
        data={pageRows}
        getRowId={(row) => row.id}
        isLoading={list.isPending}
        isRefreshing={list.isFetching && !list.isPending}
        error={list.error}
        onRetry={() => list.refetch()}
        isRetrying={list.isRefetching}
        skeletonRows={5}
        emptyMessage={EMPTY[status]}
        className="rounded-xl bg-hw-base-white"
        footer={
          artisans.length > PAGE_SIZE && (
            <DataTablePagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={artisans.length}
              onPageChange={setPage}
              noun={{ one: "artisan", other: "artisans" }}
            />
          )
        }
      />

      <ReviewSheet artisan={reviewing} onOpenChange={(open) => !open && setReviewingId(null)} onRequestChanges={requestChanges} />
      <RejectDialog artisan={rejecting} onOpenChange={(open) => !open && setRejecting(null)} onRejected={() => setRejecting(null)} />
    </section>
  )
}

export default ArtisanVerificationIndex
