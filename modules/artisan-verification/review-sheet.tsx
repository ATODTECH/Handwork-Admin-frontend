"use client"

import { ExternalLink } from "lucide-react"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { DetailRow, DetailSection } from "@/components/shared/details-part"
import { UseAvatar } from "@/components/shared/use-avatar"
import VerificationBadge from "@/components/shared/verification-badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useApproveArtisan } from "@/hooks/admin/use-artisan-review"
import { availabilityLabel, ID_DOCUMENT_LABELS } from "@/lib/artisans"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import { formatLocation } from "@/lib/locations"
import type { ArtisanForReview } from "@/types/admin/artisans"
import { fullName } from "./columns"

/** A full-size image that opens in a new tab (signed URLs expire, so never cache the link) */
const ImageLink = ({ src, alt, className }: { src: string, alt: string, className?: string }) => (
  <a href={src} target="_blank" rel="noopener noreferrer" className={className}>
    {/* eslint-disable-next-line @next/next/no-img-element -- signed, short-lived storage URL */}
    <img src={src} alt={alt} className="size-full rounded-lg border border-hw-grey-200 object-cover" />
  </a>
)

interface ReviewSheetProps {
  artisan: ArtisanForReview | null
  onOpenChange: (open: boolean) => void
  onRequestChanges: (artisan: ArtisanForReview) => void
}

/** Everything needed to decide on an artisan, with approve / request changes at the bottom */
const ReviewSheet = ({ artisan, onOpenChange, onRequestChanges }: ReviewSheetProps) => {
  const approve = useApproveArtisan()

  return (
    <DetailSheet open={artisan !== null} onOpenChange={onOpenChange} title="Artisan">
      {artisan && (
        <div className="divide-y divide-hw-grey-200">
          <div className="flex items-center gap-4 pb-4">
            <UseAvatar src={artisan.profile_image ?? ""} name={fullName(artisan)} aspectRatio="size-14" />
            <div className="flex flex-col items-start gap-1.5">
              <span className="text-lg font-semibold text-hw-grey-900">{fullName(artisan)}</span>
              {artisan.onboardingComplete ? (
                <VerificationBadge status={artisan.verification_status} />
              ) : (
                <span className="text-xs text-hw-grey-500">Still onboarding</span>
              )}
            </div>
          </div>

          {artisan.verification_status === "REJECTED" && artisan.verification_note && (
            <DetailSection title="Changes requested">
              <p className="text-[13px] text-[#626773]">{artisan.verification_note}</p>
            </DetailSection>
          )}

          <DetailSection title="Identity">
            <DetailRow label="NIN">{artisan.nin}</DetailRow>
            <DetailRow label="Document type">{artisan.document_type && ID_DOCUMENT_LABELS[artisan.document_type]}</DetailRow>
            {artisan.document ? (
              <div className="flex flex-col gap-2 pt-2">
                <ImageLink src={artisan.document} alt={`ID document for ${fullName(artisan)}`} className="block aspect-4/3 w-full" />
                <a href={artisan.document} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-hw-secondary">
                  Open full size <ExternalLink className="size-3" />
                </a>
              </div>
            ) : (
              <DetailRow label="Uploaded ID">{null}</DetailRow>
            )}
          </DetailSection>

          <DetailSection title="Work profile">
            {artisan.skill ? (
              <>
                <DetailRow label="Services">{artisan.skill.services.map(({ name }) => name).join(", ")}</DetailRow>
                <DetailRow label="Price range">
                  {formatNairaAmount(artisan.skill.base_charge)} – {formatNairaAmount(artisan.skill.cap_charge)}
                </DetailRow>
                <DetailRow label="Works">{availabilityLabel(artisan.skill)}</DetailRow>
                <p className="pt-2 text-[13px] leading-relaxed text-[#626773]">{artisan.skill.description}</p>
                {artisan.skill.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-3">
                    {artisan.skill.images.map(({ url }, index) => (
                      <ImageLink key={url} src={url} alt={`Work photo ${index + 1}`} className="block aspect-square" />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-[13px] text-[#626773]">No services added yet.</p>
            )}
          </DetailSection>

          <DetailSection title="Payout account">
            <DetailRow label="Bank">{artisan.bank_details?.name}</DetailRow>
            <DetailRow label="Account number">{artisan.bank_details?.account_number}</DetailRow>
            <DetailRow label="Account name">{artisan.bank_details?.account_name}</DetailRow>
          </DetailSection>

          <DetailSection title="Contact & location">
            <DetailRow label="Email">{artisan.email}</DetailRow>
            <DetailRow label="Phone">{artisan.contact}</DetailRow>
            <DetailRow label="Address">{artisan.address}</DetailRow>
            <DetailRow label="City / State">{formatLocation(artisan)}</DetailRow>
            <DetailRow label="Joined">{formatActivityDate(artisan.date_joined)}</DetailRow>
          </DetailSection>

          {artisan.verified_at && (
            <DetailSection title="Last review">
              <DetailRow label="Reviewed by">{artisan.verified_by}</DetailRow>
              <DetailRow label="Reviewed on">{formatActivityDate(artisan.verified_at)}</DetailRow>
            </DetailSection>
          )}

          <div className="flex items-center gap-3 pt-5">
            {artisan.verification_status !== "APPROVED" && (
              <Button
                className="flex-1 bg-[#1E338A] py-5 hover:bg-[#1E338A]/90"
                disabled={!artisan.onboardingComplete || approve.isPending}
                onClick={() => approve.mutate(artisan.id, { onSuccess: () => onOpenChange(false) })}
              >
                {approve.isPending && <Spinner data-icon="inline-start" />}
                Approve
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1 border-[#F2461D] py-5 text-[#F2461D] hover:text-[#F2461D]"
              disabled={approve.isPending}
              onClick={() => onRequestChanges(artisan)}
            >
              {artisan.verification_status === "APPROVED" ? "Revoke approval" : "Request changes"}
            </Button>
          </div>
          {!artisan.onboardingComplete && (
            <p className="pt-3 text-xs text-hw-grey-500">You can approve once they finish all three onboarding steps.</p>
          )}
        </div>
      )}
    </DetailSheet>
  )
}

export default ReviewSheet
