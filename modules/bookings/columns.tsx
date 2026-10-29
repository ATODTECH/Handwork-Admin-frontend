import { Button } from "@/components/ui/button"
import BookingStatusBadge from "@/components/account/bookings/booking-status-badge"
import { createDataTableColumns } from "@/components/table-data/columns"
import { formatActivityDate, formatNairaAmount, formatSchedule } from "@/lib/format"
import type { BookingForStaff } from "@/types/admin/bookings"

const column = createDataTableColumns<BookingForStaff>()

/** The artisan's price once set, otherwise the customer's budget */
export const bookingAmount = (booking: BookingForStaff) => Number(booking.agreed_amount ?? booking.budget) || 0

export const bookingServices = (booking: BookingForStaff) => booking.services.join(", ") || "Service request"

interface BookingTableActions {
  onView: (booking: BookingForStaff) => void
  onResolve: (booking: BookingForStaff) => void
}

export const bookingColumns = ({ onView, onResolve }: BookingTableActions) =>
  column.columns([
    column.display({
      id: "job",
      header: "Job",
      cell: ({ row: { original } }) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-hw-grey-900">{bookingServices(original)}</span>
          <span className="truncate text-xs text-hw-grey-500">
            #{original.id} · booked {formatActivityDate(original.created_at)}
          </span>
        </div>
      ),
    }),
    column.display({
      id: "people",
      header: "Customer → artisan",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ row: { original } }) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate">{original.client.name}</span>
          <span className="truncate text-xs text-hw-grey-500">→ {original.artisan?.name ?? "No artisan"}</span>
        </div>
      ),
    }),
    column.display({
      id: "amount",
      header: "Amount",
      meta: { cellClassName: "tabular-nums" },
      cell: ({ row: { original } }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-hw-grey-900">{formatNairaAmount(bookingAmount(original))}</span>
          {original.agreed_amount && Number(original.agreed_amount) !== Number(original.budget) && (
            <span className="text-xs text-hw-grey-500">Budget {formatNairaAmount(original.budget)}</span>
          )}
        </div>
      ),
    }),
    column.display({
      id: "scheduled",
      header: "Job date",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ row: { original } }) => formatSchedule(original.scheduled_date, original.scheduled_time),
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ getValue, row: { original } }) => (
        <div className="flex max-w-56 flex-col items-start gap-1">
          <BookingStatusBadge status={getValue()} viewer="staff" />
          {original.status === "Disputed" && <span className="line-clamp-2 text-xs whitespace-normal text-hw-grey-500">{original.dispute_reason}</span>}
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
          {original.status === "Disputed" && (
            <Button size="sm" onClick={() => onResolve(original)}>
              Settle
            </Button>
          )}
        </div>
      ),
    }),
  ])
