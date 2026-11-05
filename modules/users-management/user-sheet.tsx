"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { DetailRow, DetailSection } from "@/components/shared/details-part"
import { UseAvatar } from "@/components/shared/use-avatar"
import SubmitButton from "@/components/form/submit-button"
import { useReactivateUser } from "@/hooks/admin/use-users"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import { ROUTES } from "@/lib/routes"
import Link from "next/link"
import type { AdminUser } from "@/types/admin/users"

const REVIEW_LABEL = { PENDING: "Not approved yet", APPROVED: "Approved", REJECTED: "Changes requested" } as const

const roleLabel = ({ is_staff, role }: AdminUser) => (is_staff ? "Staff" : role === "ARTISAN" ? "Artisan" : "Customer")

interface UserSheetProps {
  user: AdminUser | null
  onOpenChange: (open: boolean) => void
  onDeactivate: (user: AdminUser) => void
}

/** One account's details, and deactivating or reactivating it. ID documents stay on the artisan review */
const UserSheet = ({ user, onOpenChange, onDeactivate }: UserSheetProps) => {
  const { mutate: reactivate, isPending } = useReactivateUser()

  return (
    <DetailSheet open={user !== null} onOpenChange={onOpenChange} title="User">
      {user && (
        <div className="divide-y divide-hw-grey-200">
          <div className="flex items-center gap-4 pb-5">
            <UseAvatar src={user.profile_image ?? ""} name={user.name} aspectRatio="size-14" />
            <div className="flex min-w-0 flex-col items-start gap-1.5">
              <span className="truncate text-lg font-semibold text-hw-grey-900">{user.name}</span>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">{roleLabel(user)}</Badge>
                {!user.is_active && <Badge variant="destructive">Deactivated</Badge>}
              </div>
            </div>
          </div>

          <DetailSection title="Account">
            <DetailRow label="Joined">{formatActivityDate(user.date_joined)}</DetailRow>
            <DetailRow label="Last signed in">{user.last_login ? formatActivityDate(user.last_login) : "No record"}</DetailRow>
            <DetailRow label="Bookings">{user.bookings}</DetailRow>
            <DetailRow label="Open bookings">{user.open_bookings}</DetailRow>
          </DetailSection>

          <DetailSection title="Contact and location">
            <DetailRow label="Email">{user.email}</DetailRow>
            <DetailRow label="Phone">{user.contact}</DetailRow>
            <DetailRow label="Address">{user.address}</DetailRow>
            <DetailRow label="City">{user.city}</DetailRow>
            <DetailRow label="State">{user.state}</DetailRow>
          </DetailSection>

          {user.role === "ARTISAN" && !user.is_staff && (
            <DetailSection title="Artisan">
              <DetailRow label="Review">{REVIEW_LABEL[user.verification_status]}</DetailRow>
              <DetailRow label="Wallet">{formatNairaAmount(user.wallet_balance)}</DetailRow>
              <Button variant="outline" className="mt-3 w-full" render={<Link href={ROUTES.artisans} />} nativeButton={false}>
                Open artisan reviews
              </Button>
            </DetailSection>
          )}

          {user.is_staff ? (
            <p className="pt-5 text-xs text-hw-grey-500">Staff accounts are managed in Django admin.</p>
          ) : (
            <div className="pt-5">
              {user.is_active ? (
                <Button variant="destructive" className="w-full" onClick={() => onDeactivate(user)}>
                  Deactivate account
                </Button>
              ) : (
                <SubmitButton
                  type="button"
                  size="default"
                  className="w-full"
                  pending={isPending}
                  pendingText="Reactivating…"
                  onClick={() => reactivate(user.id, { onSuccess: () => onOpenChange(false) })}
                >
                  Reactivate account
                </SubmitButton>
              )}
            </div>
          )}
        </div>
      )}
    </DetailSheet>
  )
}

export default UserSheet
