"use client"

import { useMemo, useState } from "react"
import { FilterTabs, type FilterTab } from "@/components/shared/filter-tabs"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/table-data/data-table"
import { DataTablePagination } from "@/components/table-data/data-table-pagination"
import { useAdminBookingCounts, useAdminBookings } from "@/hooks/admin/use-bookings"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import type { BookingFilter, BookingForStaff } from "@/types/admin/bookings"
import BookingSheet from "./booking-sheet"
import { bookingColumns } from "./columns"
import ResolveDialog from "./resolve-dialog"

const PAGE_SIZE = 10

const TABS: { value: BookingFilter, label: string }[] = [
  { value: "disputed", label: "Problems reported" },
  { value: "requested", label: "Requested" },
  { value: "awaiting_payment", label: "Awaiting payment" },
  { value: "in_progress", label: "Paid and in progress" },
  { value: "done", label: "Done" },
  { value: "closed", label: "Declined or cancelled" },
]

const EMPTY: Record<BookingFilter, string> = {
  disputed: "No problems to settle.",
  requested: "No requests waiting for an artisan.",
  awaiting_payment: "No accepted bookings waiting for payment.",
  in_progress: "No paid jobs in progress.",
  done: "No finished bookings yet.",
  closed: "No declined or cancelled bookings.",
}

/** Every booking by stage; reported problems come first, since their payment is held until staff settle them */
const BookingsIndex = () => {
  const heading = usePageHeading()
  const [status, setStatus] = useState<BookingFilter>("disputed")
  const [page, setPage] = useState(1)
  const [viewingId, setViewingId] = useState<number | null>(null)
  const [resolving, setResolving] = useState<BookingForStaff | null>(null)

  const list = useAdminBookings(status)
  const counts = useAdminBookingCounts()
  const bookings = list.data ?? []
  // Looked up by id, so the sheet shows the booking as it is after settling it
  const viewing = bookings.find(({ id }) => id === viewingId) ?? null
  const columns = useMemo(() => bookingColumns({ onView: ({ id }) => setViewingId(id), onResolve: setResolving }), [])
  const tabs: FilterTab<BookingFilter>[] = TABS.map((tab) => ({ ...tab, count: counts.data?.[tab.value] }))

  const lastPage = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)
  const pageRows = bookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const changeStatus = (next: BookingFilter) => {
    setStatus(next)
    setPage(1)
  }

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={heading?.title ?? "Bookings"}
        description={heading?.description ?? "Every booking on Handwork Expert."}
        action={null}
      />

      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <FilterTabs label="Booking stage" tabs={tabs} value={status} onChange={changeStatus} className="w-fit" />
      </div>

      <DataTable
        label="Bookings"
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
          bookings.length > PAGE_SIZE && (
            <DataTablePagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={bookings.length}
              onPageChange={setPage}
              noun={{ one: "booking", other: "bookings" }}
            />
          )
        }
      />

      <BookingSheet booking={viewing} onOpenChange={(open) => !open && setViewingId(null)} onResolve={setResolving} />
      <ResolveDialog booking={resolving} onOpenChange={(open) => !open && setResolving(null)} />
    </section>
  )
}

export default BookingsIndex
