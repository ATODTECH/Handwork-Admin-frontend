"use client"

import { useMemo, useState } from "react"
import { FilterSelect, type FilterOption } from "@/components/shared/filter-select"
import { FilterTabs, type FilterTab } from "@/components/shared/filter-tabs"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/table-data/data-table"
import { DataTablePagination } from "@/components/table-data/data-table-pagination"
import { useAdminReportCounts, useAdminReports } from "@/hooks/admin/use-reports"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import { TARGET_NOUNS } from "@/lib/reports"
import type { ReportTargetType } from "@/types/account/reports"
import type { ReportFilter, ReportForStaff } from "@/types/admin/reports"
import { reportColumns } from "./columns"
import ReportSheet from "./report-sheet"
import ResolveDialog from "./resolve-dialog"

const PAGE_SIZE = 10

const TABS: { value: ReportFilter, label: string }[] = [
  { value: "open", label: "Open" },
  { value: "actioned", label: "Action taken" },
  { value: "dismissed", label: "Dismissed" },
]

const EMPTY: Record<ReportFilter, string> = {
  open: "Nothing waiting. New reports from customers and artisans appear here.",
  actioned: "No reports acted on yet.",
  dismissed: "No dismissed reports.",
}

const TYPE_OPTIONS: FilterOption<ReportTargetType>[] = [
  { label: "Everything" },
  ...(Object.keys(TARGET_NOUNS) as ReportTargetType[]).map((type) => ({
    value: type,
    label: `${TARGET_NOUNS[type].charAt(0).toUpperCase()}${TARGET_NOUNS[type].slice(1)}s`,
  })),
]

/** Reports from customers and providers, for staff to dismiss or act on */
const ReportedContentIndex = () => {
  const heading = usePageHeading()
  const [status, setStatus] = useState<ReportFilter>("open")
  const [type, setType] = useState<ReportTargetType | undefined>()
  const [page, setPage] = useState(1)
  const [viewingId, setViewingId] = useState<number | null>(null)
  const [resolving, setResolving] = useState<ReportForStaff | null>(null)

  const list = useAdminReports(status)
  const counts = useAdminReportCounts()
  const reports = useMemo(() => (list.data ?? []).filter((report) => !type || report.target_type === type), [list.data, type])
  // Looked up by id, so the sheet shows the report as it is after settling it
  const viewing = list.data?.find(({ id }) => id === viewingId) ?? null
  const columns = useMemo(() => reportColumns({ onView: ({ id }) => setViewingId(id), onResolve: setResolving }), [])
  const tabs: FilterTab<ReportFilter>[] = TABS.map((tab) => ({ ...tab, count: counts.data?.[tab.value] }))

  const lastPage = Math.max(1, Math.ceil(reports.length / PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)
  const pageRows = reports.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={heading?.title ?? "Reported content"}
        description={heading?.description ?? "Reports from customers and artisans."}
        action={null}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <FilterTabs
            label="Report status"
            tabs={tabs}
            value={status}
            onChange={(next) => {
              setStatus(next)
              setPage(1)
            }}
            className="w-fit"
          />
        </div>
        <FilterSelect
          label="What was reported"
          options={TYPE_OPTIONS}
          value={type}
          onChange={(next) => {
            setType(next)
            setPage(1)
          }}
        />
      </div>

      <DataTable
        label="Reports"
        columns={columns}
        data={pageRows}
        getRowId={(row) => String(row.id)}
        isLoading={list.isPending}
        isRefreshing={list.isFetching && !list.isPending}
        error={list.error}
        onRetry={() => list.refetch()}
        isRetrying={list.isRefetching}
        skeletonRows={5}
        emptyMessage={type ? `No ${TARGET_NOUNS[type]} reports here.` : EMPTY[status]}
        className="rounded-xl bg-hw-base-white"
        footer={
          reports.length > PAGE_SIZE && (
            <DataTablePagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={reports.length}
              onPageChange={setPage}
              noun={{ one: "report", other: "reports" }}
            />
          )
        }
      />

      <ReportSheet report={viewing} onOpenChange={(open) => !open && setViewingId(null)} onResolve={setResolving} />
      <ResolveDialog report={resolving} onOpenChange={(open) => !open && setResolving(null)} />
    </section>
  )
}

export default ReportedContentIndex
