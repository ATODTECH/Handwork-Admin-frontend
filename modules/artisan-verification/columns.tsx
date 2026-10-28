import { Button } from "@/components/ui/button"
import { UseAvatar } from "@/components/shared/use-avatar"
import VerificationBadge from "@/components/shared/verification-badge"
import { createDataTableColumns } from "@/components/table-data/columns"
import { formatActivityDate } from "@/lib/format"
import { formatLocation } from "@/lib/locations"
import type { ArtisanForReview } from "@/types/admin/artisans"

const column = createDataTableColumns<ArtisanForReview>()

export const fullName = ({ first_name, last_name }: Pick<ArtisanForReview, "first_name" | "last_name">) =>
  `${first_name} ${last_name}`.trim()

export const artisanColumns = (onReview: (artisan: ArtisanForReview) => void) =>
  column.columns([
    column.display({
      id: "artisan",
      header: "Artisan",
      cell: ({ row: { original } }) => (
        <div className="flex items-center gap-3">
          <UseAvatar src={original.profile_image ?? ""} name={fullName(original)} aspectRatio="size-9" className="text-xs" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-hw-grey-900">{fullName(original)}</span>
            <span className="truncate text-xs text-hw-grey-500">{original.email}</span>
          </div>
        </div>
      ),
    }),
    column.display({
      id: "services",
      header: "Services",
      meta: { cellClassName: "max-w-64 text-hw-grey-700" },
      cell: ({ row: { original } }) => (
        <span className="line-clamp-2">{original.skill?.services.map(({ name }) => name).join(", ") || "Not added yet"}</span>
      ),
    }),
    column.display({
      id: "location",
      header: "Location",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ row: { original } }) => formatLocation(original) ?? "—",
    }),
    column.accessor("date_joined", {
      header: "Joined",
      meta: { cellClassName: "text-hw-grey-700" },
      cell: ({ getValue }) => <time dateTime={getValue()}>{formatActivityDate(getValue())}</time>,
    }),
    column.accessor("verification_status", {
      header: "Status",
      cell: ({ getValue, row: { original } }) =>
        original.onboardingComplete ? <VerificationBadge status={getValue()} /> : <span className="text-xs text-hw-grey-500">Onboarding</span>,
    }),
    column.display({
      id: "actions",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row: { original } }) => (
        <Button variant="outline" size="sm" onClick={() => onReview(original)} aria-label={`Review ${fullName(original)}`}>
          Review
        </Button>
      ),
    }),
  ])
