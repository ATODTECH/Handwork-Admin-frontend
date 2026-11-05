import { createDataTableColumns } from "@/components/table-data/columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AdminService } from "@/types/admin/services"

const column = createDataTableColumns<AdminService>()

interface ServiceTableActions {
  categoryNames: (service: AdminService) => string
  onEdit: (service: AdminService) => void
  onToggle: (service: AdminService) => void
  onDelete: (service: AdminService) => void
}

export const serviceColumns = ({ categoryNames, onEdit, onToggle, onDelete }: ServiceTableActions) =>
  column.columns([
    column.display({
      id: "service",
      header: "Service",
      cell: ({ row: { original } }) => (
        <div className="flex max-w-96 min-w-0 flex-col">
          <span className="truncate font-medium text-hw-grey-900">{original.name}</span>
          <span className="truncate text-xs text-hw-grey-500">{original.description}</span>
        </div>
      ),
    }),
    column.display({
      id: "category",
      header: "Category",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ row: { original } }) => categoryNames(original) || "None",
    }),
    column.accessor("artisans", {
      header: "Artisans",
      meta: { cellClassName: "text-hw-grey-700 tabular-nums" },
    }),
    column.accessor("bookings", {
      header: "Bookings",
      meta: { cellClassName: "text-hw-grey-700 tabular-nums" },
    }),
    column.accessor("active", {
      header: "Status",
      cell: ({ getValue }) => (getValue() ? <Badge className="bg-[#E7F6EC] text-hw-text-green-solid">Offered</Badge> : <Badge variant="secondary">Hidden</Badge>),
    }),
    column.display({
      id: "actions",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row: { original } }) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(original)}>Edit</Button>
          <Button variant="outline" size="sm" onClick={() => onToggle(original)}>{original.active ? "Hide" : "Show"}</Button>
          {/* A service in use can only be hidden */}
          {!original.artisans && !original.bookings && (
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(original)}>Delete</Button>
          )}
        </div>
      ),
    }),
  ])
