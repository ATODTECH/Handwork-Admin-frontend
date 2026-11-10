import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatNairaAmount } from "@/lib/format"
import { formatLocation } from "@/lib/locations"
import { completionLabel, includedLabel, NOT_STATED, ratingLabel, validUntilLabel } from "@/lib/offers"
import type { CustomerOffer } from "@/types/account/requests"

interface Row {
  label: string
  value: (offer: CustomerOffer) => string
  /** The provider left this out */
  missing?: (offer: CustomerOffer) => boolean
}

// The same rows for every offer, so they can be weighed up line by line (BRD US-015)
const ROWS: Row[] = [
  { label: "Price", value: (offer) => formatNairaAmount(offer.price) },
  { label: "Price type", value: (offer) => (offer.is_estimate ? "Estimate" : "Final") },
  { label: "Ready in", value: (offer) => completionLabel(offer.completion_days) },
  { label: "Materials", value: (offer) => includedLabel(offer.materials_included) },
  { label: "Labour", value: (offer) => includedLabel(offer.labour_included) },
  { label: "Extra charges", value: (offer) => offer.additional_charges || "None stated", missing: (offer) => !offer.additional_charges },
  { label: "Warranty", value: (offer) => offer.warranty || NOT_STATED, missing: (offer) => !offer.warranty },
  { label: "Valid until", value: (offer) => validUntilLabel(offer.valid_until) },
  { label: "Rating", value: (offer) => ratingLabel(offer.provider) },
  { label: "Jobs done here", value: (offer) => String(offer.provider.completed_jobs) },
  { label: "ID verified", value: (offer) => (offer.provider.verified ? "Yes" : "No") },
  { label: "Based in", value: (offer) => formatLocation(offer.provider) ?? NOT_STATED, missing: (offer) => !formatLocation(offer.provider) },
]

interface CompareTableProps {
  offers: CustomerOffer[]
  canAccept: boolean
  onAccept: (offer: CustomerOffer) => void
}

/** Open offers side by side. Nothing is marked "best": the cheapest isn't always the right one. */
const CompareTable = ({ offers, canAccept, onAccept }: CompareTableProps) => (
  <div className="-mx-1 overflow-x-auto px-1">
    <Table className="min-w-[36rem]">
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 w-36 bg-card" />
          {offers.map((offer) => (
            <TableHead key={offer.id} className="min-w-44 align-bottom font-semibold text-hw-grey-900">
              {offer.provider.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map(({ label, value, missing }) => (
          <TableRow key={label}>
            <TableCell className="sticky left-0 bg-card text-xs text-hw-grey-500">{label}</TableCell>
            {offers.map((offer) => (
              <TableCell key={offer.id} className={cn("text-sm whitespace-normal", missing?.(offer) ? "text-hw-grey-500 italic" : "text-hw-grey-900")}>
                {value(offer)}
              </TableCell>
            ))}
          </TableRow>
        ))}
        {canAccept && (
          <TableRow className="hover:bg-transparent">
            <TableCell className="sticky left-0 bg-card" />
            {offers.map((offer) => (
              <TableCell key={offer.id}>
                <Button size="sm" onClick={() => onAccept(offer)}>Accept</Button>
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
)

export default CompareTable
