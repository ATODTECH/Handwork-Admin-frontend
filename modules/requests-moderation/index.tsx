"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import FormField from "@/components/form/form-field"
import { FilterTabs, type FilterTab } from "@/components/shared/filter-tabs"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/table-data/data-table"
import { DataTablePagination } from "@/components/table-data/data-table-pagination"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import { useAdminRequestCounts, useAdminRequests } from "@/hooks/admin/use-requests"
import type { RequestFilter, RequestForStaff } from "@/types/admin/requests"
import { requestColumns } from "./columns"
import RequestSheet from "./request-sheet"

const PAGE_SIZE = 10

const TABS: { value: RequestFilter, label: string }[] = [
  { value: "open", label: "Taking offers" },
  { value: "booked", label: "Offer accepted" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Drafts" },
]

const EMPTY: Record<RequestFilter, string> = {
  open: "No requests are taking offers right now.",
  booked: "No requests have an accepted offer yet.",
  closed: "No closed requests.",
  draft: "No unpublished drafts.",
}

const matches = (request: RequestForStaff, terms: string[]) => {
  const haystack = [request.reference, request.title, request.customer.name, request.customer.email, request.city, request.state,
    ...request.services].join(" ").toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

/** Every request customers post, with its offers, for staff to moderate */
const RequestsModerationIndex = () => {
  const heading = usePageHeading()
  const [status, setStatus] = useState<RequestFilter>("open")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [viewingId, setViewingId] = useState<number | null>(null)

  const list = useAdminRequests(status)
  const counts = useAdminRequestCounts()
  const requests = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return (list.data ?? []).filter((request) => !terms.length || matches(request, terms))
  }, [list.data, query])
  const columns = useMemo(() => requestColumns({ onView: ({ id }) => setViewingId(id) }), [])
  const tabs: FilterTab<RequestFilter>[] = TABS.map((tab) => ({ ...tab, count: counts.data?.[tab.value] }))

  const lastPage = Math.max(1, Math.ceil(requests.length / PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)
  const pageRows = requests.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={heading?.title ?? "Requests and offers"}
        description={heading?.description ?? "Every request customers post, with its offers."}
        action={null}
      />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <FilterTabs
            label="Request stage"
            tabs={tabs}
            value={status}
            onChange={(next) => {
              setStatus(next)
              setPage(1)
            }}
            className="w-fit"
          />
        </div>
        <div className="w-full sm:w-80">
          <FormField
            name="request-search"
            label="Search"
            type="search"
            placeholder="Reference, title, customer or area"
            startAddon={<Search />}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
          />
        </div>
      </div>

      <DataTable
        label="Requests"
        columns={columns}
        data={pageRows}
        getRowId={(row) => String(row.id)}
        isLoading={list.isPending}
        isRefreshing={list.isFetching && !list.isPending}
        error={list.error}
        onRetry={() => list.refetch()}
        isRetrying={list.isRefetching}
        skeletonRows={5}
        emptyMessage={query.trim() ? "No requests match your search." : EMPTY[status]}
        className="rounded-xl bg-hw-base-white"
        footer={
          requests.length > PAGE_SIZE && (
            <DataTablePagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={requests.length}
              onPageChange={setPage}
              noun={{ one: "request", other: "requests" }}
            />
          )
        }
      />

      <RequestSheet requestId={viewingId} onOpenChange={(open) => !open && setViewingId(null)} />
    </section>
  )
}

export default RequestsModerationIndex
