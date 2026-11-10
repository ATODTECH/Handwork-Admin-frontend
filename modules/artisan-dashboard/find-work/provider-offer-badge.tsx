import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { formatNairaAmount } from "@/lib/format"
import { SEMANTIC_TONES, type SemanticTone } from "@/lib/tones"
import type { OfferStatus, ProviderOffer } from "@/types/account/requests"

// How a provider's own offer stands, in their words
const PROVIDER_OFFER_STATUS: Record<OfferStatus, { label: string, tone: SemanticTone }> = {
  SUBMITTED: { label: "Offer sent", tone: "info" },
  ACCEPTED: { label: "Accepted", tone: "success" },
  REJECTED: { label: "Not chosen", tone: "neutral" },
  WITHDRAWN: { label: "Withdrawn", tone: "neutral" },
  EXPIRED: { label: "Expired", tone: "warning" },
}

export const providerOfferLabel = (status: OfferStatus) => PROVIDER_OFFER_STATUS[status].label

/** The provider's offer on a request: "Offer sent · ₦22,000", "Accepted"… */
const ProviderOfferBadge = ({ offer, withPrice = true }: { offer: ProviderOffer, withPrice?: boolean }) => {
  const { label, tone } = PROVIDER_OFFER_STATUS[offer.status]
  const { chip, dot } = SEMANTIC_TONES[tone]
  return (
    <Badge className={cn("h-6 gap-1.5 px-2.5", chip)}>
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
      {withPrice && ` · ${formatNairaAmount(offer.price)}`}
    </Badge>
  )
}

export default ProviderOfferBadge
