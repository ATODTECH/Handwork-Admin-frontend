import { UseAvatar } from "@/components/shared/use-avatar"
import { createDataTableColumns } from "@/components/table-data/columns"
import { Button } from "@/components/ui/button"
import { formatActivityDay } from "@/lib/format"
import { formatLocation } from "@/lib/locations"
import type { AdminUser } from "@/types/admin/users"

const column = createDataTableColumns<AdminUser>()

export const userColumns = (onView: (user: AdminUser) => void) =>
  column.columns([
    column.display({
      id: "person",
      header: "Name",
      cell: ({ row: { original } }) => (
        <div className="flex min-w-0 items-center gap-3">
          <UseAvatar src={original.profile_image ?? ""} name={original.name} aspectRatio="size-9" className="text-xs" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-hw-grey-900">{original.name}</span>
            <span className="truncate text-xs text-hw-grey-500">{original.email}</span>
          </div>
        </div>
      ),
    }),
    column.accessor("contact", {
      header: "Phone",
      meta: { cellClassName: "text-hw-grey-700 tabular-nums" },
    }),
    column.display({
      id: "location",
      header: "Location",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ row: { original } }) => formatLocation(original) ?? "Not set",
    }),
    column.display({
      id: "bookings",
      header: "Bookings",
      meta: { cellClassName: "text-hw-grey-700 tabular-nums" },
      cell: ({ row: { original } }) => (original.open_bookings ? `${original.bookings} (${original.open_bookings} open)` : original.bookings),
    }),
    column.accessor("date_joined", {
      header: "Joined",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ getValue }) => <time dateTime={getValue()}>{formatActivityDay(getValue())}</time>,
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
